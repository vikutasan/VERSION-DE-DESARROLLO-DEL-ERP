from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import json

from core.database import get_db
from . import schemas
from .service import catalog_service

router = APIRouter()

# ─── Categorias ─────────────────────────────────────────────────────────────

@router.get("/categories", response_model=List[schemas.CategoryResponse])
async def read_categories(db: AsyncSession = Depends(get_db)):
    return await catalog_service.get_categories(db)

@router.post("/categories", response_model=schemas.CategoryResponse)
async def create_category(category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await catalog_service.create_category(db, category)

@router.put("/categories/{category_id}", response_model=schemas.CategoryResponse)
async def update_category(category_id: int, category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    result = await catalog_service.update_category(db, category_id, category)
    if not result:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return result

@router.delete("/categories/{category_id}")
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    success = await catalog_service.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return {"message": "Categoria eliminada"}

# ─── Productos ───────────────────────────────────────────────────────────────

@router.get("/products", response_model=List[schemas.ProductResponse])
async def read_products(category_id: int = None, db: AsyncSession = Depends(get_db)):
    return await catalog_service.get_products(db, category_id=category_id)

@router.post("/products", response_model=schemas.ProductResponse)
async def create_product(product: schemas.ProductCreate, db: AsyncSession = Depends(get_db)):
    return await catalog_service.create_product(db, product)

@router.put("/products/{product_id}", response_model=schemas.ProductResponse)
async def update_product(product_id: int, product: schemas.ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await catalog_service.update_product(db, product_id, product)
    if not result:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return result

@router.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    success = await catalog_service.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado"}

# ─── Importacion ─────────────────────────────────────────────────────────────

@router.post("/import-json")
async def import_json(db: AsyncSession = Depends(get_db), payload: dict = None):
    """Importa una lista de productos desde JSON sin borrar lo existente.
    Body: { "products": [...] }
    """
    if payload is None:
        raise HTTPException(status_code=400, detail="Se requiere un body JSON")
    
    products = payload.get("products", [])
    if not products:
        raise HTTPException(status_code=400, detail="La lista de productos esta vacia")

    count = await catalog_service.bulk_import(db, products)
    return {"message": f"Se importaron {count} nuevos productos exitosamente.", "count": count}
