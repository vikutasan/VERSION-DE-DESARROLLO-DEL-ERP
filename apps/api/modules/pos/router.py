from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from . import schemas
from .service import pos_service

from pydantic import BaseModel
class LockRequest(BaseModel):
    occupier_id: int
    occupier_name: str

from .occupancy import get_all_locks, lock_terminal, unlock_terminal, force_unlock, heartbeat
from modules.settings.service import get_setting_by_key

router = APIRouter()

@router.post("/sessions", response_model=schemas.TerminalSessionResponse)
async def create_session(session: schemas.TerminalSessionCreate, db: AsyncSession = Depends(get_db)):
    return await pos_service.create_session(db, session)

@router.get("/sessions/{terminal_id}/active", response_model=schemas.TerminalSessionResponse)
async def get_active_session(terminal_id: str, db: AsyncSession = Depends(get_db)):
    session = await pos_service.get_active_session(db, terminal_id)
    if not session:
        raise HTTPException(status_code=404, detail="Active session not found")
    return session

@router.post("/tickets/reserve", response_model=schemas.TicketResponse)
async def reserve_ticket(req: schemas.TerminalSessionBase, db: AsyncSession = Depends(get_db)):
    return await pos_service.reserve_ticket(db, req.terminal_id)

@router.post("/tickets", response_model=schemas.TicketResponse)
async def create_ticket(ticket: schemas.TicketCreate, db: AsyncSession = Depends(get_db)):
    return await pos_service.create_ticket(db, ticket)

@router.get("/tickets", response_model=List[schemas.TicketResponse])
async def get_tickets(
    terminal_id: str = None, 
    status: str = None, 
    search: str = None, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await pos_service.get_tickets(db, terminal_id, status, search, limit)

@router.get("/tickets/open", response_model=List[schemas.TicketResponse])
async def get_open_tickets(db: AsyncSession = Depends(get_db)):
    return await pos_service.get_open_tickets(db)

@router.get("/terminals/status")
async def get_terminals_status(db: AsyncSession = Depends(get_db)):
    try:
        ttl_setting = await get_setting_by_key(db, "pos_terminal_lock_ttl_m")
        ttl = int(ttl_setting.value)
    except Exception:
        ttl = 15
    locks = get_all_locks(ttl_minutes=ttl)
    
    from modules.cash.models import CashSession
    from sqlalchemy.future import select
    result = await db.execute(select(CashSession).where(CashSession.status == "OPEN"))
    active_cash = result.scalars().all()
    
    if active_cash:
        print(f"DEBUG: Found {len(active_cash)} open cash sessions in DB: {[c.terminal_id for c in active_cash]}")
    
    # Combinar locks efímeros en memoria y sesiones de caja reales (que persisten a reinicios)
    res = dict(locks)
    for c in active_cash:
        tid = c.terminal_id.strip() if c.terminal_id else ""
        if tid not in res:
            res[tid] = {
                "occupier_id": c.employee_id,
                "occupier_name": c.employee_name,
                "locked_at": c.opened_at,
                "is_cash_register": True
            }
        else:
            res[tid]["is_cash_register"] = True
    return res

@router.post("/terminals/{terminal_id}/lock")
async def take_terminal_lock(terminal_id: str, req: LockRequest, db: AsyncSession = Depends(get_db)):
    tid = terminal_id.strip()
    try:
        ttl_setting = await get_setting_by_key(db, "pos_terminal_lock_ttl_m")
        ttl = int(ttl_setting.value)
    except Exception:
        ttl = 15
    success = lock_terminal(tid, req.occupier_id, req.occupier_name, ttl_minutes=ttl)
    if not success:
        raise HTTPException(status_code=400, detail="Terminal ocupada por otra persona.")
    return {"status": "locked", "terminal_id": tid}

@router.post("/terminals/{terminal_id}/unlock")
async def release_terminal_lock(terminal_id: str, req: LockRequest):
    tid = terminal_id.strip()
    success = unlock_terminal(tid, req.occupier_id)
    if not success:
        raise HTTPException(status_code=403, detail="No tienes permiso para liberar esta terminal.")
    return {"status": "unlocked", "terminal_id": tid}

@router.post("/terminals/{terminal_id}/force_unlock")
async def force_terminal_unlock(terminal_id: str, db: AsyncSession = Depends(get_db)):
    from .occupancy import force_unlock
    from modules.cash.models import CashSession
    from sqlalchemy import update
    from datetime import datetime
    
    # 1. Limpiar bloqueo en memoria
    tid = terminal_id.strip()
    force_unlock(tid)
    
    # 2. Forzar cierre de cualquier sesión de caja abierta en esta terminal
    # Usamos TRIM para manejar posibles espacios en blanco si es CHAR(N)
    from sqlalchemy import func
    await db.execute(
        update(CashSession)
        .where(func.trim(CashSession.terminal_id) == terminal_id.strip(), CashSession.status == "OPEN")
        .values(status="CLOSED", closed_at=datetime.utcnow())
    )
    await db.commit()
    
    return {"status": "unlocked", "terminal_id": terminal_id}

@router.post("/terminals/{terminal_id}/heartbeat")
async def heartbeat_terminal_lock(terminal_id: str, req: LockRequest):
    tid = terminal_id.strip()
    success = heartbeat(tid, req.occupier_id)
    if not success:
        raise HTTPException(status_code=404, detail="No active lock found for this terminal/user.")
    return {"status": "alive", "terminal_id": terminal_id}

@router.post("/vision/training/upload")
async def upload_vision_training(payload: schemas.VisionTrainingUpload):
    return await pos_service.upload_training_images(payload)
