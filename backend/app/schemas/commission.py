from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommissionRecordBase(BaseModel):
    salesperson_id: int
    loan_application_id: int
    amount: float
    status: str = 'pending'

class CommissionRecordCreate(CommissionRecordBase):
    pass

class CommissionRecordUpdate(BaseModel):
    status: Optional[str] = None
    payment_date: Optional[datetime] = None

class CommissionRecord(CommissionRecordBase):
    id: int
    payment_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
