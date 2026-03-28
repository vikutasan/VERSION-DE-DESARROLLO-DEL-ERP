import asyncio
import os
import sys

# Asegurar que se puede importar core y modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import AsyncSessionLocal
from modules.catalog.models import Category
from sqlalchemy.future import select

async def seed_descontinuados():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Category).where(Category.name == "DESCONTINUADOS"))
        cat = result.scalar_one_or_none()
        if not cat:
            cat = Category(
                name="DESCONTINUADOS",
                icon="🗑️",
                position=999,
                vision_enabled=False,
                is_system=True
            )
            db.add(cat)
            await db.commit()
            print("EXITO: Creada categoría de sistema DESCONTINUADOS")
        else:
            cat.is_system = True
            cat.vision_enabled = False
            await db.commit()
            print("EXITO: Actualizada categoría existente DESCONTINUADOS para ser de sistema")

if __name__ == "__main__":
    asyncio.run(seed_descontinuados())
