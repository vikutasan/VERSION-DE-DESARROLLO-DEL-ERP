from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from . import models, schemas
from modules.production import service as prod_service
from modules.production import schemas as prod_schemas


class CatalogService:
    async def get_categories(self, db: AsyncSession):
        result = await db.execute(select(models.Category))
        return result.scalars().all()

    async def create_category(self, db: AsyncSession, category: schemas.CategoryCreate):
        db_category = models.Category(**category.model_dump())
        db.add(db_category)
        await db.commit()
        await db.refresh(db_category)
        return db_category

    async def update_category(self, db: AsyncSession, category_id: int, category: schemas.CategoryCreate):
        result = await db.execute(select(models.Category).where(models.Category.id == category_id))
        db_cat = result.scalar_one_or_none()
        if not db_cat:
            return None
        db_cat.name = category.name
        db_cat.icon = category.icon
        await db.commit()
        await db.refresh(db_cat)
        return db_cat

    async def delete_category(self, db: AsyncSession, category_id: int):
        result = await db.execute(select(models.Category).where(models.Category.id == category_id))
        db_cat = result.scalar_one_or_none()
        if not db_cat:
            return False
        await db.delete(db_cat)
        await db.commit()
        return True

    async def get_products(self, db: AsyncSession, category_id: int = None):
        query = select(models.Product).options(
            selectinload(models.Product.category), 
            selectinload(models.Product.technical_sheet)
        )
        if category_id:
            query = query.where(models.Product.category_id == category_id)
        result = await db.execute(query)
        return result.scalars().all()

    async def create_product(self, db: AsyncSession, product: schemas.ProductCreate):
        product_data = product.model_dump(exclude={"technical_data"})
        db_product = models.Product(**product_data)
        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        
        if product.technical_data:
            tech_data = prod_schemas.TechnicalSheetCreate(product_id=db_product.id, **product.technical_data)
            await prod_service.upsert_technical_sheet(db, tech_data)

        result = await db.execute(
            select(models.Product)
            .options(selectinload(models.Product.category), selectinload(models.Product.technical_sheet))
            .where(models.Product.id == db_product.id)
        )
        return result.scalar_one()

    async def update_product(self, db: AsyncSession, product_id: int, product: schemas.ProductUpdate):
        result = await db.execute(
            select(models.Product).where(models.Product.id == product_id)
        )
        db_product = result.scalar_one_or_none()
        if not db_product:
            return None
            
        product_data = product.model_dump(exclude={"technical_data"}, exclude_unset=True)
        for key, value in product_data.items():
            setattr(db_product, key, value)
            
        await db.commit()
        await db.refresh(db_product)
        
        if product.technical_data is not None:
            # Evitar colisión de product_id si viene en technical_data
            t_data = product.technical_data.copy()
            t_data.pop("product_id", None)
            tech_data = prod_schemas.TechnicalSheetCreate(product_id=product_id, **t_data)
            await prod_service.upsert_technical_sheet(db, tech_data)

        result = await db.execute(
            select(models.Product)
            .options(selectinload(models.Product.category), selectinload(models.Product.technical_sheet))
            .where(models.Product.id == product_id)
        )
        return result.scalar_one()

    async def delete_product(self, db: AsyncSession, product_id: int):
        result = await db.execute(select(models.Product).where(models.Product.id == product_id))
        db_product = result.scalar_one_or_none()
        if not db_product:
            return False
        await db.delete(db_product)
        await db.commit()
        return True

    async def clear_catalog(self, db: AsyncSession):
        """Función deshabilitada por seguridad."""
        pass

    async def bulk_import(self, db: AsyncSession, data: list):
        """Importa una lista de productos en masa, creando categorias si no existen y evitando duplicados exactos."""
        count = 0
        for item in data:
            name = str(item.get('name', '')).strip()
            price = float(item.get('price', 0))
            sku = str(item.get('sku', '')).strip()

            if not name: continue

            # Evitar duplicados por nombre y SKU
            existing = await db.execute(select(models.Product).where((models.Product.name == name) & (models.Product.sku == sku)))
            if existing.scalar_one_or_none():
                continue

            cat_name = str(item.get('category', 'GENERAL')).strip().upper()
            if not cat_name or cat_name == 'NAN':
                cat_name = 'GENERAL'

            result = await db.execute(select(models.Category).where(models.Category.name == cat_name))
            db_category = result.scalar_one_or_none()
            if not db_category:
                db_category = models.Category(name=cat_name, icon="📦")
                db.add(db_category)
                await db.flush()

            db_product = models.Product(
                name=name,
                price=price,
                sku=sku or f"SKU-{count}",
                category=db_category
            )
            db.add(db_product)
            count += 1

        await db.commit()
        return count


catalog_service = CatalogService()
