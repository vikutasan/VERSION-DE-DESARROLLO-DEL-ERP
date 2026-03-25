import asyncio
from sqlalchemy import select
from core.database import AsyncSessionLocal
from modules.pos.models import Ticket, TerminalSession

async def check():
    async with AsyncSessionLocal() as db:
        try:
            # Ver tickets PAID recientes
            result = await db.execute(
                select(Ticket, TerminalSession.terminal_id)
                .join(TerminalSession)
                .order_by(Ticket.created_at.desc())
                .limit(10)
            )
            rows = result.all()
            print("--- Tickets Recientes ---")
            for ticket, term_id in rows:
                print(f"ID: {ticket.id}, Status: {ticket.status}, Term: {term_id}, Total: {ticket.total}, Created: {ticket.created_at}")
                print(f"  Payments: {ticket.payment_details}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check())
