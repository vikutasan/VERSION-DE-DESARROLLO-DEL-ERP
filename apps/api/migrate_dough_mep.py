import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import sys

# Replace with your actual database URL
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/rderico"

async def migrate_dough_mep():
    print("Migrating database for Dough MEP enhancements...")
    engine = create_async_engine(DATABASE_URL)
    
    try:
        async with engine.begin() as conn:
            # 1. Add description to doughs if not exists
            print("1. Adding description to doughs...")
            await conn.execute(text("ALTER TABLE doughs ADD COLUMN IF NOT EXISTS description TEXT"))
            
            # 2. Add pieces_per_baston to dough_product_relations
            print("2. Adding pieces_per_baston to dough_product_relations...")
            await conn.execute(text("ALTER TABLE dough_product_relations ADD COLUMN IF NOT EXISTS pieces_per_baston INTEGER"))
            
            # 3. Create dough_relations table if not exists (for prefermentos)
            print("3. Creating dough_relations table...")
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS dough_relations (
                    id SERIAL PRIMARY KEY,
                    dough_id INTEGER NOT NULL REFERENCES doughs(id) ON DELETE CASCADE,
                    related_dough_id INTEGER NOT NULL REFERENCES doughs(id),
                    qty_per_baston DOUBLE PRECISION NOT NULL
                )
            """))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_dough_relations_id ON dough_relations (id)"))
            
            print("Migration completed successfully!")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        sys.exit(1)
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(migrate_dough_mep())
