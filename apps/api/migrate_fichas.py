import asyncio
from sqlalchemy import text
from core.database import engine, Base
from modules.catalog.models import Category, Product
from modules.production.models import MassManager, ProductTechnicalSheet

async def migrate():
    print("=== MIGRACIÓN V3: Fichas Técnicas ===")
    
    async with engine.begin() as conn:
        print("[1/2] Actualizando tabla 'products'...")
        try:
            # Añadir nuevas columnas base
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS nature VARCHAR DEFAULT 'MANUFACTURADO'"))
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS cost FLOAT DEFAULT 0.0"))
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS stock FLOAT DEFAULT 0.0"))
            await conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse VARCHAR DEFAULT 'Bóveda Central'"))
            
            await conn.execute(text("UPDATE products SET nature = 'MANUFACTURADO' WHERE nature IS NULL"))
        except Exception as e:
            print(f"  Aviso (Products): {e}")

    async with engine.begin() as conn:
        print("[2/2] Creando nuevas tablas de Producción...")
        # create_all creará mass_manager y product_technical_sheets si no existen
        await conn.run_sync(Base.metadata.create_all)
        
    print("=== MIGRACIÓN COMPLETADA EXITOSAMENTE ===")

if __name__ == "__main__":
    asyncio.run(migrate())
