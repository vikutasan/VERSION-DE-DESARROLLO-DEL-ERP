from typing import Dict
from pydantic import BaseModel
from datetime import datetime, timedelta

# Diccionario en memoria: terminal_id -> info
# Esto es seguro porque uvicorn corre con 1 solo worker.
_locks: Dict[str, dict] = {}

# TTL: los candados mueren automáticamente si no se renuevan (10 minutos)
def _purge_stale_locks(ttl_minutes: int = 15):
    """Elimina candados cuyo timestamp supere el TTL."""
    now = datetime.utcnow()
    stale = [tid for tid, info in _locks.items()
             if now - info.get("locked_at", now) > timedelta(minutes=ttl_minutes)]
    for tid in stale:
        print(f"TTL: Auto-liberando terminal {tid} (lock expirado con TTL {ttl_minutes}m)")
        del _locks[tid]

def get_all_locks(ttl_minutes: int = 15) -> Dict[str, dict]:
    _purge_stale_locks(ttl_minutes)
    return _locks

def lock_terminal(terminal_id: str, occupier_id: int, occupier_name: str, ttl_minutes: int = 15) -> bool:
    _purge_stale_locks(ttl_minutes)
    if terminal_id in _locks:
        if _locks[terminal_id]["occupier_id"] == occupier_id:
            _locks[terminal_id]["locked_at"] = datetime.utcnow()  # Renueva TTL
            return True
        return False
    
    _locks[terminal_id] = {
        "occupier_id": occupier_id,
        "occupier_name": occupier_name,
        "locked_at": datetime.utcnow()
    }
    return True

def unlock_terminal(terminal_id: str, occupier_id: int) -> bool:
    if terminal_id in _locks:
        if _locks[terminal_id]["occupier_id"] == occupier_id:
            del _locks[terminal_id]
            return True
        return False
    return True

def force_unlock(terminal_id: str):
    if terminal_id in _locks:
        del _locks[terminal_id]

def heartbeat(terminal_id: str, occupier_id: int) -> bool:
    """Renueva el timestamp del candado para evitar que expire por TTL."""
    if terminal_id in _locks:
        if _locks[terminal_id]["occupier_id"] == occupier_id:
            _locks[terminal_id]["locked_at"] = datetime.utcnow()
            return True
    return False
