from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from modules.catalog.schemas import ProductResponse
from modules.security.schemas import EmployeeResponse

# --- Ticket Item ---
class TicketItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class TicketItemCreate(TicketItemBase):
    pass

class TicketItemResponse(TicketItemBase):
    id: int
    unit_price: float
    subtotal: float
    product: Optional[ProductResponse] = None
    model_config = ConfigDict(from_attributes=True)

# --- Ticket ---
class TicketBase(BaseModel):
    account_num: str
    session_id: int

class TicketCreate(TicketBase):
    items: List[TicketItemCreate]
    status: Optional[str] = "OPEN"
    payment_details: Optional[List] = None
    cash_session_id: Optional[int] = None
    captured_by_id: Optional[int] = None
    cashed_by_id: Optional[int] = None

class TicketResponse(TicketBase):
    id: int
    total: float
    status: str
    payment_details: Optional[List] = None
    cash_session_id: Optional[int] = None
    captured_by_id: Optional[int] = None
    cashed_by_id: Optional[int] = None
    captured_by: Optional[EmployeeResponse] = None
    cashed_by: Optional[EmployeeResponse] = None
    captured_by_name: Optional[str] = None
    cashed_by_name: Optional[str] = None
    terminal_id: Optional[str] = None
    created_at: datetime
    items: List[TicketItemResponse] = []
    model_config = ConfigDict(from_attributes=True)

# --- Terminal Session ---
class TerminalSessionBase(BaseModel):
    terminal_id: str

class TerminalSessionCreate(TerminalSessionBase):
    pass

class TerminalSessionResponse(TerminalSessionBase):
    id: int
    opened_at: datetime
    closed_at: Optional[datetime] = None
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

# --- Vision Training ---
class VisionTrainingUpload(BaseModel):
    sku: str
    images: List[str] # List of base64 strings

# --- Vision Prediction ---
class VisionPredictionRequest(BaseModel):
    image: str # Base64 string from camera
    terminal_id: Optional[str] = "T1"

class VisionDetection(BaseModel):
    label: str # SKU or Product Name
    qty: int = 1
    confidence: float # 0.0 to 1.0

class VisionPredictionResponse(BaseModel):
    detections: List[VisionDetection]
    engine: str # "local" or "cloud"
    latency_ms: float
