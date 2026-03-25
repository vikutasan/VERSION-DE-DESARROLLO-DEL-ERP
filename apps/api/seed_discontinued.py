import asyncio
from core.database import AsyncSessionLocal
from sqlalchemy import text

async def seed_discontinued():
    print("Iniciando creacion de categoria DESCONTINUADOS (Correccion SQL)...")
    
    async with AsyncSessionLocal() as session:
        check_sql = text("SELECT id FROM categories WHERE name = 'DESCONTINUADOS'")
        res = await session.execute(check_sql)
        row = res.fetchone()
        
        if not row:
            print("Creando categoria: DESCONTINUADOS")
            insert_sql = text("INSERT INTO categories (name, icon, vision_enabled) VALUES ('DESCONTINUADOS', '🗑️', false)")
            await session.execute(insert_sql)
            await session.commit()
            print("Categoria DESCONTINUADOS creada exitosamente.")
        else:
            print(f"La categoria DESCONTINUADOS ya existe (ID: {row[0]}).")
            
if __name__ == "__main__":
    asyncio.run(seed_discontinued())
