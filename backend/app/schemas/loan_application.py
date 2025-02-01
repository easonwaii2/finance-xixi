from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class LoanApplicationBase(BaseModel):
    enterprise_id: int
    loan_product_id: int
    amount: float
    term_months: int
    purpose: str
    salesperson_id: int

class LoanApplicationCreate(LoanApplicationBase):
    pass

class LoanApplicationUpdate(BaseModel):
    status: Optional[str] = None
    amount: Optional[float] = None
    term_months: Optional[int] = None
    purpose: Optional[str] = None

class LoanApplication(LoanApplicationBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
