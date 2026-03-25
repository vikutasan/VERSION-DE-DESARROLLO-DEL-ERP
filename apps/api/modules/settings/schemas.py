from pydantic import BaseModel
from typing import Optional

class SystemSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    category: str = "general"
    input_type: str = "text"

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    value: str

class SystemSettingResponse(SystemSettingBase):
    id: int

    class Config:
        from_attributes = True
