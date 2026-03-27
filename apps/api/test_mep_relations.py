import asyncio
from core.database import engine
from sqlalchemy import text

async def seed():
    async with engine.begin() as conn:
        res = await conn.execute(text("""
            INSERT INTO products (sku, name, price, stock, active, nature)
            VALUES ('BOL-TEST', 'BOLILLO DE PRUEBA', 5.0, 100, true, 'MANUFACTURADO')
            RETURNING id
        """))
        pid = res.scalar()
        
        # Test dough creation
        did = await conn.execute(text("""
            INSERT INTO doughs (code, name, dough_type, description, theoretical_yield, expected_waste, requires_rest)
            VALUES ('TEST-MEP', 'MASA TEST', 'MASA SALADA', 'Description test', 4800, 0, false)
            RETURNING id
        """))
        dough_id = did.scalar()
        
        # Test product relation
        await conn.execute(text("""
            INSERT INTO dough_product_relations (dough_id, product_id, grams_per_piece, pieces_per_baston)
            VALUES (:did, :pid, 50, 36)
        """), {"did": dough_id, "pid": pid})
        
        # Test batches 
        await conn.execute(text("""
            INSERT INTO dough_batch_configs (dough_id, name, baston_qty)
            VALUES (:did, '4B', 4)
        """), {"did": dough_id})
        
        print(f"Created product {pid} and dough {dough_id} successfully")

asyncio.run(seed())
