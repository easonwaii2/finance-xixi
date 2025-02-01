from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    enterprise_id = Column(Integer, ForeignKey("enterprises.id"))
    loan_product_id = Column(Integer, ForeignKey("loan_products.id"))
    amount = Column(Float)
    term_months = Column(Integer)
    purpose = Column(String(1000))
    status = Column(Enum('pending', 'in_review', 'approved', 'rejected', 'disbursed'), default='pending')
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    enterprise = relationship("Enterprise", back_populates="loan_applications")
    loan_product = relationship("LoanProduct", back_populates="applications")
    salesperson = relationship("User", back_populates="handled_applications")
    approval_records = relationship("ApprovalRecord", back_populates="loan_application")
    repayment_plans = relationship("RepaymentPlan", back_populates="loan_application")
