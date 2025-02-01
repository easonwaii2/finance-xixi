from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EnterpriseBase(BaseModel):
    name: str
    registration_number: str
    legal_representative: str
    contact_phone: str
    contact_email: EmailStr
    address: str
    business_scope: str
    registered_capital: float
    established_date: datetime

class EnterpriseCreate(EnterpriseBase):
    pass

class EnterpriseUpdate(EnterpriseBase):
    pass

class Enterprise(EnterpriseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
