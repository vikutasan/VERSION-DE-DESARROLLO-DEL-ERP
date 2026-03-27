from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from . import schemas, service

router = APIRouter()

@router.get("/doughs", response_model=list[schemas.DoughResponse])
async def list_doughs(db: AsyncSession = Depends(get_db)):
    """List all dough recipes"""
    return await service.list_doughs(db)

@router.post("/doughs", response_model=schemas.DoughResponse)
async def create_dough(dough: schemas.DoughCreate, db: AsyncSession = Depends(get_db)):
    """Create a new dough and its related entities"""
    return await service.create_dough(db, dough)

@router.get("/doughs/{dough_id}", response_model=schemas.DoughResponse)
async def get_dough(dough_id: int, db: AsyncSession = Depends(get_db)):
    dough = await service.get_dough(db, dough_id)
    if not dough:
        raise HTTPException(status_code=404, detail="Dough not found")
    return dough

@router.put("/doughs/{dough_id}", response_model=schemas.DoughResponse)
async def update_dough(dough_id: int, dough: schemas.DoughCreate, db: AsyncSession = Depends(get_db)):
    updated = await service.update_dough(db, dough_id, dough)
    if not updated:
        raise HTTPException(status_code=404, detail="Dough not found")
    return updated

@router.post("/doughs/reorder")
async def reorder_doughs(req: schemas.DoughReorderRequest, db: AsyncSession = Depends(get_db)):
    """Reorder doughs based on the provided list of IDs"""
    await service.reorder_doughs(db, req.order)
    return {"status": "ok"}
