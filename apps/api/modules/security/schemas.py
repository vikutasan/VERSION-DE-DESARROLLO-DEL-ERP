from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any


# --- Perfiles de Seguridad ---
class ProfileCreate(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: Dict[str, Any] = {}
    is_system: bool = False


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[Dict[str, Any]] = None
    is_system: Optional[bool] = None


class ProfileResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    permissions: Dict[str, Any]
    is_system: bool
    employee_count: int = 0
    model_config = ConfigDict(from_attributes=True)


# --- Creación de Empleado ---
class EmployeeCreate(BaseModel):
    name: str
    employee_code: str  # PIN de 4-6 dígitos
    role: str = "CAJERO"
    profile_id: Optional[int] = None


# --- Actualización de Empleado ---
class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    employee_code: Optional[str] = None
    role: Optional[str] = None
    profile_id: Optional[int] = None


# --- Respuesta de Empleado ---
class EmployeeResponse(BaseModel):
    id: int
    name: str
    employee_code: str
    role: str
    profile_id: Optional[int]
    profile: Optional[ProfileResponse] = None
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


# --- Validación de PIN ---
class PINValidateRequest(BaseModel):
    pin: str


class PINValidateResponse(BaseModel):
    id: int
    name: str
    role: str
    profile: Optional[ProfileResponse] = None
