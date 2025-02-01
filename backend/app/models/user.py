from sqlalchemy import Boolean, Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(Enum('admin', 'business', 'approver', 'finance'), nullable=False)
    is_active = Column(Boolean, default=True)

    salesperson_profile = relationship("Salesperson", back_populates="user", uselist=False)
    handled_applications = relationship("LoanApplication", back_populates="salesperson")
    approval_records = relationship("ApprovalRecord", back_populates="approver")
