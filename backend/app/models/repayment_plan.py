from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class RepaymentPlan(Base):
    __tablename__ = "repayment_plans"

    id = Column(Integer, primary_key=True, index=True)
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"))
    installment_number = Column(Integer)
    due_date = Column(DateTime)
    principal_amount = Column(Float)
    interest_amount = Column(Float)
    status = Column(Enum('pending', 'paid', 'overdue'), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    loan_application = relationship("LoanApplication", back_populates="repayment_plans")
