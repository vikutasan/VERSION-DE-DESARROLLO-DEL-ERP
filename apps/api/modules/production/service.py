from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from . import models, schemas

async def list_masses(db: AsyncSession):
    result = await db.execute(select(models.MassManager))
    return result.scalars().all()

async def create_mass(db: AsyncSession, data: schemas.MassCreate):
    new_mass = models.MassManager(**data.model_dump())
    db.add(new_mass)
    await db.commit()
    await db.refresh(new_mass)
    return new_mass

async def get_technical_sheet(db: AsyncSession, product_id: int):
    result = await db.execute(select(models.ProductTechnicalSheet).where(models.ProductTechnicalSheet.product_id == product_id))
    return result.scalar_one_or_none()

async def upsert_technical_sheet(db: AsyncSession, data: schemas.TechnicalSheetCreate):
    result = await db.execute(select(models.ProductTechnicalSheet).where(models.ProductTechnicalSheet.product_id == data.product_id))
    sheet = result.scalar_one_or_none()
    
    if sheet:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(sheet, key, value)
    else:
        sheet = models.ProductTechnicalSheet(**data.model_dump())
        db.add(sheet)
        
    await db.commit()
    await db.refresh(sheet)
    return sheet
