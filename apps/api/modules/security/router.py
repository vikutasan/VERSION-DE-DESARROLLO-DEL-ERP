from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from . import schemas, service

router = APIRouter()


# --- Endpoints de Perfiles ---

@router.get("/profiles", response_model=List[schemas.ProfileResponse])
async def listar_perfiles(db: AsyncSession = Depends(get_db)):
    return await service.listar_perfiles(db)


@router.post("/profiles", response_model=schemas.ProfileResponse, status_code=201)
async def crear_perfil(datos: schemas.ProfileCreate, db: AsyncSession = Depends(get_db)):
    return await service.crear_perfil(db, datos)


@router.put("/profiles/{perfil_id}", response_model=schemas.ProfileResponse)
async def actualizar_perfil(perfil_id: int, datos: schemas.ProfileUpdate, db: AsyncSession = Depends(get_db)):
    return await service.actualizar_perfil(db, perfil_id, datos)


@router.delete("/profiles/{perfil_id}")
async def eliminar_perfil(perfil_id: int, db: AsyncSession = Depends(get_db)):
    return await service.eliminar_perfil(db, perfil_id)


@router.post("/profiles/seed", status_code=201)
async def sembrar_perfiles(db: AsyncSession = Depends(get_db)):
    await service.sembrar_perfiles_base(db)
    return {"message": "Perfiles base sembrados correctamente"}


# --- Endpoints de Empleados ---

@router.post("/employees", response_model=schemas.EmployeeResponse, status_code=201)
async def crear_empleado(datos: schemas.EmployeeCreate, db: AsyncSession = Depends(get_db)):
    return await service.crear_empleado(db, datos)


@router.get("/employees", response_model=List[schemas.EmployeeResponse])
async def listar_empleados(db: AsyncSession = Depends(get_db)):
    return await service.listar_empleados(db)


@router.post("/employees/validate-pin", response_model=schemas.PINValidateResponse)
async def validar_pin(datos: schemas.PINValidateRequest, db: AsyncSession = Depends(get_db)):
    return await service.validar_pin(db, datos.pin)


@router.put("/employees/{empleado_id}", response_model=schemas.EmployeeResponse)
async def actualizar_empleado(
    empleado_id: int, datos: schemas.EmployeeUpdate, db: AsyncSession = Depends(get_db)
):
    return await service.actualizar_empleado(db, empleado_id, datos)


@router.patch("/employees/{empleado_id}/deactivate")
async def desactivar_empleado(empleado_id: int, db: AsyncSession = Depends(get_db)):
    return await service.desactivar_empleado(db, empleado_id)
