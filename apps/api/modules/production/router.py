from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from . import schemas, service

router = APIRouter()

@router.get("/masses", response_model=list[schemas.MassResponse])
async def get_masses(db: AsyncSession = Depends(get_db)):
    return await service.list_masses(db)

@router.post("/masses", response_model=schemas.MassResponse)
async def create_new_mass(mass: schemas.MassCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_mass(db, mass)
