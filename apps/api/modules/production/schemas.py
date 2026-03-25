from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class MassBase(BaseModel):
    name: str
    total_yield_grams: float
    loss_percentage: float = 0.0
    tfm_celsius: Optional[float] = None
    autolysis_time_min: Optional[int] = None
    kneading_time_low_min: Optional[int] = None
    kneading_time_high_min: Optional[int] = None
    bulk_fermentation_time_min: Optional[int] = None
    bulk_fermentation_temp_celsius: Optional[float] = None
    folds_count: int = 0

class MassCreate(MassBase):
    pass

class MassResponse(MassBase):
    id: int
    class Config:
        from_attributes = True

class TechnicalSheetBase(BaseModel):
    primary_mass_id: Optional[int] = None
    secondary_mass_id: Optional[int] = None
    tertiary_mass_id: Optional[int] = None
    weight_per_piece: Optional[float] = None
    
    baking_temp_top: Optional[float] = None
    baking_temp_bottom: Optional[float] = None
    baking_time_min: Optional[int] = None
    steam_seconds: Optional[int] = None
    scoring_type: Optional[str] = None
    
    forming_procedure: Optional[str] = None
    bom_extra: Optional[List[Dict[str, Any]]] = None

    preparation_time_min: Optional[int] = None
    recipe_procedure: Optional[str] = None
    modifiers: Optional[List[Dict[str, Any]]] = None

    provider: Optional[str] = None
    original_barcode: Optional[str] = None
    unit_measure: Optional[str] = None
    min_stock: Optional[int] = None
    max_stock: Optional[int] = None

class TechnicalSheetCreate(TechnicalSheetBase):
    product_id: int

class TechnicalSheetResponse(TechnicalSheetBase):
    id: int
    product_id: int
    class Config:
        from_attributes = True
