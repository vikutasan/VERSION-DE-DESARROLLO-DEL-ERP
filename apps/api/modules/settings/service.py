from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from . import models, schemas
from fastapi import HTTPException

async def get_settings(db: AsyncSession):
    result = await db.execute(select(models.SystemSetting))
    return result.scalars().all()

async def get_setting_by_key(db: AsyncSession, key: str):
    result = await db.execute(select(models.SystemSetting).where(models.SystemSetting.key == key))
    setting = result.scalar_one_or_none()
    if not setting:
        raise HTTPException(status_code=404, detail=f"Setting {key} not found")
    return setting

async def update_setting(db: AsyncSession, key: str, value: str):
    setting = await get_setting_by_key(db, key)
    setting.value = value
    await db.commit()
    await db.refresh(setting)
    return setting

async def seed_settings(db: AsyncSession):
    default_settings = [
        {
            "key": "pos_terminal_status_polling_ms",
            "value": "3000",
            "description": "Frecuencia de actualización del estado de las terminales en milisegundos.",
            "category": "polling",
            "input_type": "number"
        },
        {
            "key": "pos_terminal_lock_ttl_m",
            "value": "15",
            "description": "Tiempo de expiración del bloqueo de terminal (minutos) si no hay latido.",
            "category": "security",
            "input_type": "number"
        },
        {
            "key": "pos_heartbeat_interval_ms",
            "value": "60000",
            "description": "Frecuencia de envío de latido de vida desde el POS (milisegundos).",
            "category": "polling",
            "input_type": "number"
        }
    ]
    
    for s_data in default_settings:
        result = await db.execute(select(models.SystemSetting).where(models.SystemSetting.key == s_data["key"]))
        if not result.scalar_one_or_none():
            db.add(models.SystemSetting(**s_data))
    
    await db.commit()
