from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class ApprovalRecord(Base):
    __tablename__ = "approval_records"

    id = Column(Integer, primary_key=True, index=True)
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"))
    approver_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum('approved', 'rejected', 'pending'), default='pending')
    comments = Column(String(1000))
    approval_level = Column(Integer)  # For multi-level approval process
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    loan_application = relationship("LoanApplication", back_populates="approval_records")
    approver = relationship("User", back_populates="approval_records")
