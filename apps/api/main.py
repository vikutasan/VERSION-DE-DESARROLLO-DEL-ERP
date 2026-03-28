from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from modules.catalog.router import router as catalog_router
from modules.pos.router import router as pos_router
from modules.security.router import router as security_router
from modules.cash.router import router as cash_router
from modules.settings.router import router as settings_router
from modules.production.router import router as production_router
from core.database import AsyncSessionLocal
from modules.catalog.models import Category

app = FastAPI(
    title="R de Rico ERP API",
    description="Backend Monolito Modular para ERP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def ensure_system_categories():
    """Asegura que la categoría 'DESCONTINUADOS' exista como categoría de sistema."""
    async with AsyncSessionLocal() as db:
        try:
            from sqlalchemy import select
            # Verificar si existe
            stmt = select(Category).where(Category.name == "DESCONTINUADOS")
            result = await db.execute(stmt)
            category = result.scalar_one_or_none()

            if not category:
                new_cat = Category(
                    name="DESCONTINUADOS",
                    icon="🗑️",
                    position=999,
                    vision_enabled=False,
                    is_system=True
                )
                db.add(new_cat)
                await db.commit()
                print("Categoría 'DESCONTINUADOS' creada como sistema.")
            else:
                # Asegurar que sea de sistema
                if not category.is_system:
                    category.is_system = True
                    category.vision_enabled = False
                    await db.commit()
                    print("Categoría 'DESCONTINUADOS' actualizada como sistema.")
        except Exception as e:
            print(f"Error asegurando categorías de sistema: {e}")
            await db.rollback()

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

app.include_router(catalog_router, prefix="/api/v1/catalog", tags=["Catalog"])
app.include_router(pos_router, prefix="/api/v1/pos", tags=["POS"])
app.include_router(security_router, prefix="/api/v1/security", tags=["Security"])
app.include_router(cash_router, prefix="/api/v1/cash", tags=["Cash"])
app.include_router(settings_router, prefix="/api/v1/settings", tags=["Settings"])
app.include_router(production_router, prefix="/api/v1/production", tags=["Production"])

# Montar carpeta de imágenes estáticas
app.mount("/static/catalog", StaticFiles(directory="static/catalog"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
