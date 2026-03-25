from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from datetime import datetime

from . import models, schemas
from modules.pos.models import Ticket, TerminalSession


async def abrir_sesion(db: AsyncSession, datos: schemas.CashSessionCreate) -> models.CashSession:
    """Abre una nueva sesión de caja para un cajero en una terminal."""
    sesion_existente = await _obtener_sesion_activa(db, datos.terminal_id)
    if sesion_existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe una sesión activa en esta terminal. Ciérrela antes de abrir una nueva."
        )

    nueva_sesion = models.CashSession(
        terminal_id=datos.terminal_id,
        employee_id=datos.employee_id,
        employee_name=datos.employee_name,
        opening_float=datos.opening_float,
    )
    db.add(nueva_sesion)
    await db.commit()
    # Cargar preventivamente las relaciones tras el commit para que estén disponibles en el Response
    resultado = await db.execute(
        select(models.CashSession)
        .where(models.CashSession.id == nueva_sesion.id)
        .options(
            selectinload(models.CashSession.movements),
            selectinload(models.CashSession.tickets)
        )
    )
    return resultado.scalar_one()


async def obtener_sesion_activa(db: AsyncSession, terminal_id: str) -> models.CashSession | None:
    """Devuelve la sesión activa de una terminal, o None si no hay ninguna."""
    return await _obtener_sesion_activa(db, terminal_id)


async def _obtener_sesion_activa(db: AsyncSession, terminal_id: str) -> models.CashSession | None:
    """Helper interno para consultar la sesión activa con sus movimientos."""
    resultado = await db.execute(
        select(models.CashSession)
        .where(
            models.CashSession.terminal_id == terminal_id,
            models.CashSession.status == "OPEN",
        )
        .options(
            selectinload(models.CashSession.movements),
            selectinload(models.CashSession.tickets)
        )
    )
    return resultado.scalar_one_or_none()


async def agregar_movimiento(
    db: AsyncSession, session_id: int, datos: schemas.CashMovementCreate
) -> models.CashMovement:
    """Registra una entrada o salida de dinero en el turno activo."""
    sesion = await _obtener_sesion_por_id(db, session_id)

    movimiento = models.CashMovement(
        cash_session_id=sesion.id,
        movement_type=datos.movement_type,
        amount=datos.amount,
        concept=datos.concept,
    )
    db.add(movimiento)
    await db.commit()
    await db.refresh(movimiento)
    return movimiento


async def eliminar_movimiento(db: AsyncSession, session_id: int, movimiento_id: int) -> dict:
    """Elimina un movimiento de efectivo previamente registrado."""
    resultado = await db.execute(
        select(models.CashMovement).where(
            models.CashMovement.id == movimiento_id,
            models.CashMovement.cash_session_id == session_id,
        )
    )
    movimiento = resultado.scalar_one_or_none()
    if not movimiento:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")

    await db.delete(movimiento)
    await db.commit()
    return {"message": "Movimiento eliminado"}


async def calcular_resumen(db: AsyncSession, session_id: int) -> schemas.CashSummaryResponse:
    """
    Calcula el resumen financiero del turno en tiempo real.
    Suma los tickets PAID de la sesión y los movimientos de efectivo registrados.
    """
    sesion = await _obtener_sesion_por_id(db, session_id)
    movimientos = await _obtener_movimientos(db, session_id)

    total_entradas = sum(m.amount for m in movimientos if m.movement_type == "ENTRADA")
    total_salidas = sum(m.amount for m in movimientos if m.movement_type == "SALIDA")

    tickets_pagados = await _obtener_tickets_pagados(db, session_id)

    total_efectivo_ventas = 0.0
    total_credito = 0.0
    total_debito = 0.0

    for ticket in tickets_pagados:
        if not ticket.payment_details:
            continue
            
        for pago in ticket.payment_details:
            metodo = (pago.get("method") or "").upper()
            tipo = (pago.get("type") or "").upper()
            monto = float(pago.get("amount") or 0)
            
            if metodo == "EFECTIVO":
                total_efectivo_ventas += monto
            elif "CRÉDITO" in tipo or "CREDITO" in tipo or "CRÉDITO" in metodo or "CREDITO" in metodo:
                total_credito += monto
            elif "DÉBITO" in tipo or "DEBITO" in tipo or "DÉBITO" in metodo or "DEBITO" in metodo:
                total_debito += monto
            elif metodo == "TARJETA":
                # Fallback si no tiene tipo específico
                total_debito += monto

    efectivo_esperado = sesion.opening_float + total_efectivo_ventas + total_entradas - total_salidas
    total_ventas = total_efectivo_ventas + total_credito + total_debito

    return schemas.CashSummaryResponse(
        efectivo_esperado=round(efectivo_esperado, 2),
        total_credito=round(total_credito, 2),
        total_debito=round(total_debito, 2),
        total_ventas=round(total_ventas, 2),
        num_transacciones=len(tickets_pagados),
        fondo_inicial=sesion.opening_float,
        total_entradas=round(total_entradas, 2),
        total_salidas=round(total_salidas, 2),
    )


async def cerrar_sesion(
    db: AsyncSession, session_id: int, datos: schemas.CashSessionClose
) -> schemas.CashCloseResponse:
    """
    Cierra el turno de caja, guarda los montos físicos contados
    y calcula las diferencias respecto al sistema.
    """
    sesion = await _obtener_sesion_por_id(db, session_id)
    resumen = await calcular_resumen(db, session_id)

    sesion.status = "CLOSED"
    sesion.closed_at = datetime.utcnow()
    sesion.physical_cash = datos.physical_cash
    sesion.physical_credit = datos.physical_credit
    sesion.physical_debit = datos.physical_debit

    await db.commit()
    await db.refresh(sesion)

    return schemas.CashCloseResponse(
        sesion=sesion,
        resumen=resumen,
        diferencia_efectivo=round(datos.physical_cash - resumen.efectivo_esperado, 2),
        diferencia_credito=round(datos.physical_credit - resumen.total_credito, 2),
        diferencia_debito=round(datos.physical_debit - resumen.total_debito, 2),
    )


async def obtener_historial_sesiones(db: AsyncSession, terminal_id: str = None, limit: int = 50) -> list[models.CashSession]:
    """Obtiene el historial de sesiones de caja cerradas con sus resúmenes y tickets."""
    query = (
        select(models.CashSession)
        .where(models.CashSession.status == "CLOSED")
        .options(
            selectinload(models.CashSession.movements),
            selectinload(models.CashSession.tickets)
        )
    )
    
    if terminal_id:
        query = query.where(models.CashSession.terminal_id == terminal_id)
        
    query = query.order_by(models.CashSession.closed_at.desc()).limit(limit)
    
    resultado = await db.execute(query)
    sesiones = resultado.scalars().all()
    
    # Inyectar resumen calculado a cada sesión para la auditoría
    for sesion in sesiones:
        resumen = await calcular_resumen(db, sesion.id)
        sesion.resumen = resumen
        
    return sesiones


# --- Helpers privados ---

async def _obtener_sesion_por_id(db: AsyncSession, session_id: int) -> models.CashSession:
    resultado = await db.execute(
        select(models.CashSession)
        .where(models.CashSession.id == session_id)
        .options(
            selectinload(models.CashSession.movements),
            selectinload(models.CashSession.tickets)
        )
    )
    sesion = resultado.scalar_one_or_none()
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión de caja no encontrada")
    return sesion


async def _obtener_movimientos(db: AsyncSession, session_id: int) -> list[models.CashMovement]:
    resultado = await db.execute(
        select(models.CashMovement).where(models.CashMovement.cash_session_id == session_id)
    )
    return resultado.scalars().all()


async def _obtener_tickets_pagados(
    db: AsyncSession, session_id: int
) -> list[Ticket]:
    """Obtiene todos los tickets pagados vinculados a la sesión de caja específica."""
    resultado = await db.execute(
        select(Ticket).where(
            Ticket.status == "PAID",
            Ticket.cash_session_id == session_id
        )
    )
    return resultado.scalars().all()
