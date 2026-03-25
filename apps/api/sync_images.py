import os
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from modules.catalog.models import Product
import modules.production.models
from sqlalchemy import select

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static", "catalog")
BASE_URL = "http://localhost:3001/static/catalog"

async def sync():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Product))
        products = result.scalars().all()
        updated = 0
        for p in products:
            sku = p.sku
            if not sku:
                continue
                
            filenames = [
                f"{sku}.png",
                f"{sku}.jpg",
                f"Img1118_{sku}.png",
                f"Img1118_{sku}.jpg"
            ]
            for fn in filenames:
                file_path = os.path.join(STATIC_DIR, fn)
                if os.path.exists(file_path):
                    p.image_url = f"{BASE_URL}/{fn}"
                    updated += 1
                    print(f"Enlazado: {sku} -> {fn}")
                    break
        
        await session.commit()
        print(f"\nOperacion finalizada. {updated} productos actualizados exitosamente en la DB con URLs maestras.")

if __name__ == "__main__":
    asyncio.run(sync())
