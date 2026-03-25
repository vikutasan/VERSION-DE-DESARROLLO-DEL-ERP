from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from modules.catalog.router import router as catalog_router
from modules.pos.router import router as pos_router
from modules.security.router import router as security_router
from modules.cash.router import router as cash_router
from modules.settings.router import router as settings_router
from modules.production.router import router as production_router

app = FastAPI(
    title="R de Rico ERP API",
    description="Backend Monolito Modular para ERP",
    version="1.0.0"
)

# Configurar CORS (Permitir requests desde React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://192.168.1.117:3000",
        "http://192.168.1.117:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
