from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


# --- Movimientos ---
class CashMovementCreate(BaseModel):
    movement_type: str  # ENTRADA, SALIDA
    amount: float
    concept: str


class CashMovementResponse(BaseModel):
    id: int
    movement_type: str
    amount: float
    concept: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Sesión de Caja ---
class CashSessionCreate(BaseModel):
    terminal_id: str
    employee_id: int
    employee_name: str
    opening_float: float


# --- Tickets Simplificados para Auditoría ---
class TicketBasicResponse(BaseModel):
    id: int
    account_num: str
    total: float
    status: str
    model_config = ConfigDict(from_attributes=True)


class CashSessionResponse(BaseModel):
    id: int
    terminal_id: str
    employee_id: int
    employee_name: str
    opening_float: float
    status: str
    opened_at: datetime
    closed_at: Optional[datetime] = None
    movements: List[CashMovementResponse] = []
    tickets: List[TicketBasicResponse] = []
    resumen: Optional['CashSummaryResponse'] = None
    model_config = ConfigDict(from_attributes=True)


# --- Resumen en Tiempo Real ---
class CashSummaryResponse(BaseModel):
    efectivo_esperado: float
    total_credito: float
    total_debito: float
    total_ventas: float
    num_transacciones: int
    fondo_inicial: float
    total_entradas: float
    total_salidas: float


# --- Cierre de Turno ---
class CashSessionClose(BaseModel):
    physical_cash: float
    physical_credit: float
    physical_debit: float


class CashCloseResponse(BaseModel):
    sesion: CashSessionResponse
    resumen: CashSummaryResponse
    diferencia_efectivo: float
    diferencia_credito: float
    diferencia_debito: float
