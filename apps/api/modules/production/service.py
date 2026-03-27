from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from . import models, schemas

async def list_doughs(db: AsyncSession):
    result = await db.execute(select(models.Dough).order_by(models.Dough.position.asc()).options(
        selectinload(models.Dough.ingredients),
        selectinload(models.Dough.procedure_steps),
        selectinload(models.Dough.product_relations),
        selectinload(models.Dough.dough_relations),
        selectinload(models.Dough.batches)
    ))
    return result.scalars().all()

async def get_dough(db: AsyncSession, dough_id: int):
    result = await db.execute(select(models.Dough).where(models.Dough.id == dough_id).options(
        selectinload(models.Dough.ingredients),
        selectinload(models.Dough.procedure_steps),
        selectinload(models.Dough.product_relations),
        selectinload(models.Dough.dough_relations),
        selectinload(models.Dough.batches)
    ))
    return result.scalar_one_or_none()

async def create_dough(db: AsyncSession, data: schemas.DoughCreate):
    # Separate nested from main
    dough_data = data.model_dump(exclude={'ingredients', 'procedure_steps', 'product_relations', 'dough_relations', 'batches'})
    
    new_dough = models.Dough(**dough_data)
    
    # Nested lists
    for ing in data.ingredients:
        new_dough.ingredients.append(models.DoughIngredient(**ing.model_dump()))
    for step in data.procedure_steps:
        new_dough.procedure_steps.append(models.DoughProcedureStep(**step.model_dump()))
    for prod in data.product_relations:
        new_dough.product_relations.append(models.DoughProductRelation(**prod.model_dump()))
    for d_rel in data.dough_relations:
        new_dough.dough_relations.append(models.DoughRelation(**d_rel.model_dump()))
    for batch in data.batches:
        new_dough.batches.append(models.DoughBatchConfig(**batch.model_dump()))
        
    db.add(new_dough)
    await db.commit()
    await db.refresh(new_dough)
    
    return await get_dough(db, new_dough.id)

async def update_dough(db: AsyncSession, dough_id: int, data: schemas.DoughCreate):
    existing_dough = await get_dough(db, dough_id)
    if not existing_dough:
        return None
        
    # Update main fields
    dough_data = data.model_dump(exclude={'ingredients', 'procedure_steps', 'product_relations', 'dough_relations', 'batches'})
    for key, value in dough_data.items():
        setattr(existing_dough, key, value)
        
    # Refresh nested relations (simple approach: clear and recreate)
    existing_dough.ingredients = []
    for ing in data.ingredients:
        existing_dough.ingredients.append(models.DoughIngredient(**ing.model_dump()))
        
    existing_dough.procedure_steps = []
    for step in data.procedure_steps:
        existing_dough.procedure_steps.append(models.DoughProcedureStep(**step.model_dump()))
        
    existing_dough.product_relations = []
    for prod in data.product_relations:
        existing_dough.product_relations.append(models.DoughProductRelation(**prod.model_dump()))
        
    existing_dough.dough_relations = []
    for d_rel in data.dough_relations:
        existing_dough.dough_relations.append(models.DoughRelation(**d_rel.model_dump()))
        
    existing_dough.batches = []
    for batch in data.batches:
        existing_dough.batches.append(models.DoughBatchConfig(**batch.model_dump()))

    await db.commit()
    await db.refresh(existing_dough)
    return await get_dough(db, dough_id)

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

async def reorder_doughs(db: AsyncSession, order: List[int]):
    """Actualiza la posición de las masas basándose en el orden de IDs recibido."""
    for idx, d_id in enumerate(order):
        await db.execute(
            update(models.Dough)
            .where(models.Dough.id == d_id)
            .values(position=idx)
        )
    await db.commit()
    return True
