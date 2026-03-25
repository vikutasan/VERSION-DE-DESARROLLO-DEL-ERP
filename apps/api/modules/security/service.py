from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from fastapi import HTTPException

from . import models, schemas


# --- Gestión de Perfiles ---

async def listar_perfiles(db: AsyncSession) -> list[models.SecurityProfile]:
    """Obtiene todos los perfiles registrados con su conteo de empleados activos."""
    resultado = await db.execute(select(models.SecurityProfile))
    perfiles = resultado.scalars().all()
    
    # Calcular conteo de empleados para cada perfil
    for p in perfiles:
        res_count = await db.execute(
            select(models.Employee).where(
                models.Employee.profile_id == p.id,
                models.Employee.is_active == True
            )
        )
        # Nota: scalars().all() + len() es ineficiente pero simple para este volumen. 
        # En prod real usaríamos func.count()
        p.employee_count = len(res_count.scalars().all())
        
    return perfiles


async def crear_perfil(db: AsyncSession, datos: schemas.ProfileCreate) -> models.SecurityProfile:
    """Crea un nuevo perfil de seguridad."""
    perfil = models.SecurityProfile(**datos.model_dump())
    db.add(perfil)
    await db.commit()
    await db.refresh(perfil)
    perfil.employee_count = 0
    return perfil


async def actualizar_perfil(
    db: AsyncSession, perfil_id: int, datos: schemas.ProfileUpdate
) -> models.SecurityProfile:
    """Actualiza un perfil existente."""
    resultado = await db.execute(select(models.SecurityProfile).where(models.SecurityProfile.id == perfil_id))
    perfil = resultado.scalar_one_or_none()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    # Protección: No permitir cambiar el nombre de perfiles del sistema
    if perfil.is_system and datos.name and datos.name != perfil.name:
        raise HTTPException(status_code=400, detail="No se puede cambiar el nombre de un perfil del sistema")
    
    if datos.name is not None:
        perfil.name = datos.name
    if datos.description is not None:
        perfil.description = datos.description
    if datos.permissions is not None:
        perfil.permissions = datos.permissions
        
    await db.commit()
    await db.refresh(perfil)
    
    # Re-calcular conteo para la respuesta
    res_count = await db.execute(
        select(models.Employee).where(
            models.Employee.profile_id == perfil.id,
            models.Employee.is_active == True
        )
    )
    perfil.employee_count = len(res_count.scalars().all())
    
    return perfil


async def eliminar_perfil(db: AsyncSession, perfil_id: int) -> dict:
    """Elimina un perfil si no es del sistema y no tiene empleados vinculados."""
    resultado = await db.execute(select(models.SecurityProfile).where(models.SecurityProfile.id == perfil_id))
    perfil = resultado.scalar_one_or_none()
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    if perfil.is_system:
        raise HTTPException(status_code=400, detail="No se pueden eliminar perfiles del sistema")
        
    # Verificar si hay empleados ACTIVOS vinculados
    res_emp_activos = await db.execute(
        select(models.Employee).where(
            models.Employee.profile_id == perfil_id,
            models.Employee.is_active == True
        )
    )
    if res_emp_activos.scalar_one_or_none():
        raise HTTPException(
            status_code=400, 
            detail="No se puede eliminar el perfil porque tiene empleados activos vinculados. Desactívelos o reasígnelos primero."
        )

    # Desvincular empleados inactivos antes de borrar el perfil
    await db.execute(
        update(models.Employee)
        .where(models.Employee.profile_id == perfil_id)
        .values(profile_id=None)
    )

    await db.delete(perfil)
    await db.commit()
    return {"message": "Perfil eliminado correctamente"}


async def sembrar_perfiles_base(db: AsyncSession):
    """Crea los perfiles por defecto si no existen."""
    perfiles = [
        {"name": "ADMIN", "description": "Acceso total al sistema", "permissions": {"all": "full"}, "is_system": True},
        {"name": "MANAGER", "description": "Gestión operativa y reportes", "permissions": {"pos": "full", "inventory": "full", "cash": "full"}, "is_system": True},
        {"name": "CAJERO", "description": "Operación de ventas y caja", "permissions": {"pos": "full", "cash": "limited"}, "is_system": True},
    ]
    
    for p_data in perfiles:
        resultado = await db.execute(select(models.SecurityProfile).where(models.SecurityProfile.name == p_data["name"]))
        if not resultado.scalar_one_or_none():
            nuevo = models.SecurityProfile(**p_data)
            db.add(nuevo)
    
    await db.commit()


# --- Gestión de Empleados ---

async def crear_empleado(db: AsyncSession, datos: schemas.EmployeeCreate) -> models.Employee:
    """Crea un nuevo empleado con su PIN de acceso."""
    empleado_existente = await db.execute(
        select(models.Employee).where(models.Employee.employee_code == datos.employee_code)
    )
    if empleado_existente.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="El código de empleado ya existe")

    nuevo_empleado = models.Employee(
        name=datos.name,
        employee_code=datos.employee_code,
        role=datos.role,
        profile_id=datos.profile_id
    )
    db.add(nuevo_empleado)
    await db.commit()
    
    # Carga preventiva para evitar lazy loading error
    resultado = await db.execute(
        select(models.Employee)
        .where(models.Employee.id == nuevo_empleado.id)
        .options(selectinload(models.Employee.profile))
    )
    return resultado.scalar_one()


async def listar_empleados(db: AsyncSession) -> list[models.Employee]:
    """Devuelve todos los empleados activos del sistema."""
    resultado = await db.execute(
        select(models.Employee)
        .where(models.Employee.is_active == True)
        .options(selectinload(models.Employee.profile))
    )
    return resultado.scalars().all()


async def validar_pin(db: AsyncSession, pin: str) -> schemas.PINValidateResponse:
    """
    Valida el PIN ingresado por el cajero.
    Devuelve el nombre y objeto de perfil si el PIN es correcto.
    """
    resultado = await db.execute(
        select(models.Employee).where(
            models.Employee.employee_code == pin,
            models.Employee.is_active == True,
        ).options(selectinload(models.Employee.profile))
    )
    empleado = resultado.scalar_one_or_none()
    if not empleado:
        raise HTTPException(status_code=401, detail="PIN incorrecto o empleado inactivo")

    # Serialización manual para evitar errores de lazy loading (MissingGreenlet)
    perfil_data = None
    if empleado.profile:
        perfil_data = {
            "id": empleado.profile.id,
            "name": empleado.profile.name,
            "description": empleado.profile.description,
            "permissions": empleado.profile.permissions,
            "is_system": empleado.profile.is_system,
            "employee_count": 0 # No es necesario el conteo para el login
        }

    return schemas.PINValidateResponse(
        id=empleado.id,
        name=empleado.name,
        role=empleado.profile.name if empleado.profile else empleado.role,
        profile=perfil_data
    )


async def actualizar_empleado(
    db: AsyncSession, empleado_id: int, datos: schemas.EmployeeUpdate
) -> models.Employee:
    """Actualiza los datos de un empleado existente."""
    resultado = await db.execute(
        select(models.Employee).where(models.Employee.id == empleado_id)
    )
    empleado = resultado.scalar_one_or_none()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if datos.name is not None:
        empleado.name = datos.name
    if datos.employee_code is not None:
        empleado.employee_code = datos.employee_code
    if datos.role is not None:
        empleado.role = datos.role
    if datos.profile_id is not None:
        empleado.profile_id = datos.profile_id

    await db.commit()
    
    resultado = await db.execute(
        select(models.Employee)
        .where(models.Employee.id == empleado_id)
        .options(selectinload(models.Employee.profile))
    )
    return resultado.scalar_one()


async def desactivar_empleado(db: AsyncSession, empleado_id: int) -> dict:
    """Desactiva un empleado."""
    resultado = await db.execute(
        select(models.Employee).where(models.Employee.id == empleado_id)
    )
    empleado = resultado.scalar_one_or_none()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    empleado.is_active = False
    await db.commit()
    return {"message": f"Empleado {empleado.name} desactivado correctamente"}
