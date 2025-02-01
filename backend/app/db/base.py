from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Import all models here for Alembic
from app.models.user import User
from app.models.loan_product import LoanProduct
from app.models.enterprise import Enterprise
from app.models.loan_application import LoanApplication
from app.models.approval_record import ApprovalRecord
from app.models.repayment_plan import RepaymentPlan
from app.models.repayment_record import RepaymentRecord
from app.models.salesperson import Salesperson
from app.models.commission_record import CommissionRecord

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
