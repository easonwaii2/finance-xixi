from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Enterprise(Base):
    __tablename__ = "enterprises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    registration_number = Column(String(255), unique=True)
    legal_representative = Column(String(255))
    contact_phone = Column(String(50))
    contact_email = Column(String(255))
    address = Column(String(500))
    business_scope = Column(String(1000))
    registered_capital = Column(Float)
    established_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    loan_applications = relationship("LoanApplication", back_populates="enterprise")
