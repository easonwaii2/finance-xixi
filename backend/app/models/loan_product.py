from sqlalchemy import Column, Integer, String, Float, Enum, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class LoanProduct(Base):
    __tablename__ = "loan_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    product_type = Column(String(255))
    interest_rate = Column(Float)
    term_months = Column(Integer)
    repayment_method = Column(Enum('monthly', 'quarterly', 'annually'))
    min_amount = Column(Float)
    max_amount = Column(Float)
    is_active = Column(Boolean, default=True)

    applications = relationship("LoanApplication", back_populates="loan_product")
