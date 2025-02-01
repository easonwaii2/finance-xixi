from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class RepaymentRecord(Base):
    __tablename__ = "repayment_records"

    id = Column(Integer, primary_key=True, index=True)
    repayment_plan_id = Column(Integer, ForeignKey("repayment_plans.id"))
    amount_paid = Column(Float)
    payment_date = Column(DateTime)
    payment_method = Column(String(50))
    transaction_reference = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    repayment_plan = relationship("RepaymentPlan")
