from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SalespersonBase(BaseModel):
    user_id: int
    region: str
    target_amount: float

class SalespersonCreate(SalespersonBase):
    pass

class SalespersonUpdate(BaseModel):
    region: Optional[str] = None
    target_amount: Optional[float] = None

class Salesperson(SalespersonBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
