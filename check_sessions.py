
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import os
import sys

# Add apps/api to path to import models
sys.path.append(os.path.join(os.getcwd(), 'apps', 'api'))

from modules.cash.models import CashSession
from core.database import Base

DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/rderico"

async def check_sessions():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        result = await session.execute(select(CashSession).where(CashSession.status == 'OPEN'))
        sessions = result.scalars().all()
        
        print(f"FOUND {len(sessions)} OPEN SESSIONS:")
        for s in sessions:
            print(f"ID: {s.id} | Terminal: {s.terminal_id} | Employee: {s.employee_name} (ID: {s.employee_id}) | Opened: {s.opened_at}")

if __name__ == "__main__":
    asyncio.run(check_sessions())
