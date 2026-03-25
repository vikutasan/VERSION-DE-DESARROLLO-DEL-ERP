from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from modules.production.schemas import TechnicalSheetResponse

# --- Categoria ---
class CategoryBase(BaseModel):
    name: str
    icon: Optional[str] = None
    vision_enabled: bool = False

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Producto ---
class ProductBase(BaseModel):
    sku: str
    barcode: Optional[str] = None
    name: str
    price: float
    cost: Optional[float] = 0.0
    stock: Optional[float] = 0.0
    warehouse: Optional[str] = "Bóveda Central"
    image_url: Optional[str] = None
    position: Optional[int] = None
    nature: str = "MANUFACTURADO"
    category_id: Optional[int] = None
    active: bool = True

class ProductCreate(ProductBase):
    technical_data: Optional[Dict[str, Any]] = None

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    name: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    stock: Optional[float] = None
    warehouse: Optional[str] = None
    image_url: Optional[str] = None
    position: Optional[int] = None
    nature: Optional[str] = None
    category_id: Optional[int] = None
    active: Optional[bool] = None
    technical_data: Optional[Dict[str, Any]] = None

class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None
    technical_sheet: Optional[TechnicalSheetResponse] = None
    model_config = ConfigDict(from_attributes=True)
