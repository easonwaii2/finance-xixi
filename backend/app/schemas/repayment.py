from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RepaymentPlanBase(BaseModel):
    loan_application_id: int
    installment_number: int
    due_date: datetime
    principal_amount: float
    interest_amount: float
    status: str = 'pending'

class RepaymentPlanCreate(RepaymentPlanBase):
    pass

class RepaymentPlanUpdate(BaseModel):
    status: Optional[str] = None
    due_date: Optional[datetime] = None

class RepaymentPlan(RepaymentPlanBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RepaymentRecordBase(BaseModel):
    repayment_plan_id: int
    amount_paid: float
    payment_date: datetime
    payment_method: str
    transaction_reference: str

class RepaymentRecordCreate(RepaymentRecordBase):
    pass

class RepaymentRecordUpdate(BaseModel):
    amount_paid: Optional[float] = None
    payment_method: Optional[str] = None
    transaction_reference: Optional[str] = None

class RepaymentRecord(RepaymentRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
