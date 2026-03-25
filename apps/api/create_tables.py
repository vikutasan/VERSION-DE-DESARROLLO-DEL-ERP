import asyncio
from core.database import engine, Base
from modules.security.models import SecurityProfile, Employee
# Necesito importar todos los modelos para que Base los reconozca
from modules.catalog.models import Category, Product
from modules.pos.models import Ticket, TerminalSession
from modules.cash.models import CashSession, CashMovement
from modules.settings.models import SystemSetting

async def create_tables():
    print("Creando nuevas tablas...")
    async with engine.begin() as conn:
        # Esto creará solo las tablas que no existen
        await conn.run_sync(Base.metadata.create_all)
    print("Tablas creadas exitosamente.")

if __name__ == "__main__":
    asyncio.run(create_tables())
