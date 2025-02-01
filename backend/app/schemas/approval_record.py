from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApprovalRecordBase(BaseModel):
    loan_application_id: int
    approver_id: int
    status: str
    comments: str
    approval_level: int

class ApprovalRecordCreate(ApprovalRecordBase):
    pass

class ApprovalRecordUpdate(BaseModel):
    status: Optional[str] = None
    comments: Optional[str] = None

class ApprovalRecord(ApprovalRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
