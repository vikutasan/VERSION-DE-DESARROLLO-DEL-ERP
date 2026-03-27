import asyncio
import sys
import os

sys.path.append('/app')

from sqlalchemy import text
from core.database import engine

async def migrate():
    async with engine.begin() as conn:
        print("Migrating product_technical_sheets: Adding mass gram columns...")
        cols = [
            "primary_mass_grams",
            "secondary_mass_grams",
            "tertiary_mass_grams"
        ]
        for col in cols:
            # PostgreSQL check
            result = await conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name='product_technical_sheets' AND column_name='{col}'"))
            if not result.scalar():
                print(f"Adding column {col}...")
                await conn.execute(text(f"ALTER TABLE product_technical_sheets ADD COLUMN {col} DOUBLE PRECISION DEFAULT 0.0"))
            else:
                print(f"Column {col} already exists.")
        print("Migration completed.")

if __name__ == "__main__":
    asyncio.run(migrate())
