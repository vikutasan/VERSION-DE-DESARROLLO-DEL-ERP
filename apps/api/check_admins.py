import asyncio
from core.database import AsyncSessionLocal
from sqlalchemy import select
from modules.security.models import Employee, SecurityProfile

async def q():
    async with AsyncSessionLocal() as db:
        r = await db.execute(
            select(Employee.name, Employee.employee_code, SecurityProfile.name)
            .join(SecurityProfile)
            .where(Employee.is_active == True)
        )
        for name, code, role in r.all():
            print(f"User: {name} | PIN: {code} | Role: {role}")

if __name__ == "__main__":
    asyncio.run(q())
