from pydantic import BaseModel, Field
from typing import Optional, List

# Dough Procedure Steps
class DoughProcedureStepBase(BaseModel):
    step_number: int
    task: str
    description: Optional[str] = None
    equipment: Optional[str] = None
    speed: Optional[str] = None
    time_minutes: int = 0

class DoughProcedureStepCreate(DoughProcedureStepBase):
    pass

class DoughProcedureStepResponse(DoughProcedureStepBase):
    id: int
    class Config:
        from_attributes = True

# Dough Ingredients
class DoughIngredientBase(BaseModel):
    name: str
    qty_per_baston: float
    unit: str = "g"
    mep_type: Optional[str] = None # POLVOS, LIQUIDOS, PRE-FERMENTO
    preferment_id: Optional[int] = None

class DoughIngredientCreate(DoughIngredientBase):
    pass

class DoughIngredientResponse(DoughIngredientBase):
    id: int
    class Config:
        from_attributes = True

# Dough Product Relations
class DoughProductRelationBase(BaseModel):
    product_id: int
    grams_per_piece: float
    pieces_per_baston: Optional[int] = None

class DoughProductRelationCreate(DoughProductRelationBase):
    pass

class DoughProductRelationResponse(DoughProductRelationBase):
    id: int
    class Config:
        from_attributes = True

# Dough Relations (Prefermentos)
class DoughRelationBase(BaseModel):
    related_dough_id: int
    qty_per_baston: float

class DoughRelationCreate(DoughRelationBase):
    pass

class DoughRelationResponse(DoughRelationBase):
    id: int
    class Config:
        from_attributes = True

# Batches (Tandas)
class DoughBatchConfigBase(BaseModel):
    name: str
    baston_qty: float

class DoughBatchConfigCreate(DoughBatchConfigBase):
    pass

class DoughBatchConfigResponse(DoughBatchConfigBase):
    id: int
    class Config:
        from_attributes = True

from typing import Dict, Any

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

# Main Dough
class DoughBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    dough_type: str
    requires_rest: bool = False
    rest_container: Optional[str] = None
    rest_warehouse: Optional[str] = None
    rest_time_min: Optional[int] = None
    theoretical_yield: Optional[float] = None
    expected_waste: float = 0.0

class DoughCreate(DoughBase):
    ingredients: List[DoughIngredientCreate] = []
    procedure_steps: List[DoughProcedureStepCreate] = []
    product_relations: List[DoughProductRelationCreate] = []
    dough_relations: List[DoughRelationCreate] = []
    batches: List[DoughBatchConfigCreate] = []

class DoughResponse(DoughBase):
    id: int
    ingredients: List[DoughIngredientResponse] = []
    procedure_steps: List[DoughProcedureStepResponse] = []
    product_relations: List[DoughProductRelationResponse] = []
    dough_relations: List[DoughRelationResponse] = []
    batches: List[DoughBatchConfigResponse] = []
    
    class Config:
        from_attributes = True
