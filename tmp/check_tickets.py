import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, func
from apps.api.modules.pos.models import Ticket
from apps.api.core.config import settings

async def check_tickets():
    # Use the same logic as in core/database.py but adjust host for local execution if needed
    # Since I'm on the same system, but "db" might be a docker host, I'll try to use localhost if "db" fails
    # But usually the agent runs in an environment where it can reach the DB or I'll just look at the .env if I can find it.
    # Wait, I didn't find .env. Let's assume the default in config.py might work if I change host to localhost.
    
    url = settings.ASYNC_DATABASE_URL.replace("@db:", "@localhost:")
    print(f"Connecting to {url}...")
    
    engine = create_async_engine(url)
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with async_session() as session:
        result = await session.execute(
            select(Ticket.status, func.count(Ticket.id))
            .group_by(Ticket.status)
        )
        counts = result.all()
        print("Ticket counts by status:")
        for status, count in counts:
            print(f"  {status}: {count}")
            
        result = await session.execute(
            select(Ticket.account_num)
            .where(Ticket.status == "OPEN")
            .where(Ticket.total > 0)
        )
        open_tickets = result.scalars().all()
        print(f"\nOpen tickets with total > 0 ({len(open_tickets)}):")
        for num in open_tickets:
            print(f"  {num}")

if __name__ == "__main__":
    try:
        asyncio.run(check_tickets())
    except Exception as e:
        print(f"Error: {e}")
