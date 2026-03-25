from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from core.config import settings

# Crear motor de base de datos asíncrono
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True, # Muestra logs SQL en desarrollo
    future=True
)

# Constructor de sesiones asíncronas
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base declarativa para modelos
Base = declarative_base()

# Dependencia para inyectar en routers de FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
