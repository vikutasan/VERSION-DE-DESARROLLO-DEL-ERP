
import asyncio
import sys
import os

# Añadir el path raíz al sistema para importar core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api')))

from core.database import async_session
from sqlalchemy import text

async def migrate():
    print("Iniciando migración de nombres de perfiles maestros...")
    async with async_session() as session:
        # Usamos SQL directo para saltar validaciones de nivel aplicación
        await session.execute(text("UPDATE security_profiles SET name = 'MASTER' WHERE name = 'ADMIN' AND is_system = true"))
        await session.execute(text("UPDATE security_profiles SET name = 'GERENTE' WHERE name = 'MANAGER' AND is_system = true"))
        await session.commit()
        print("Migración completada con éxito: ADMIN -> MASTER, MANAGER -> GERENTE.")

if __name__ == "__main__":
    asyncio.run(migrate())
