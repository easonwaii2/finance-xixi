from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class CommissionRecord(Base):
    __tablename__ = "commission_records"

    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("salespeople.id"))
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"))
    amount = Column(Float)
    status = Column(Enum('pending', 'paid', 'cancelled'), default='pending')
    payment_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    salesperson = relationship("Salesperson")
    loan_application = relationship("LoanApplication")
