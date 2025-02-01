from pydantic import BaseModel
from typing import Optional

class LoanProductBase(BaseModel):
    name: str
    product_type: str
    interest_rate: float
    term_months: int
    repayment_method: str
    min_amount: float
    max_amount: float
    is_active: Optional[bool] = True

class LoanProductCreate(LoanProductBase):
    pass

class LoanProductUpdate(LoanProductBase):
    pass

class LoanProduct(LoanProductBase):
    id: int

    class Config:
        from_attributes = True
