from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.loan_application import LoanApplication
from app.schemas.loan_application import LoanApplicationCreate, LoanApplicationUpdate

class CRUDLoanApplication(CRUDBase[LoanApplication, LoanApplicationCreate, LoanApplicationUpdate]):
    def get_by_enterprise(self, db: Session, enterprise_id: int) -> List[LoanApplication]:
        return db.query(self.model).filter(self.model.enterprise_id == enterprise_id).all()

    def get_by_salesperson(self, db: Session, salesperson_id: int) -> List[LoanApplication]:
        return db.query(self.model).filter(self.model.salesperson_id == salesperson_id).all()

    def get_by_status(self, db: Session, status: str) -> List[LoanApplication]:
        return db.query(self.model).filter(self.model.status == status).all()

crud_loan_application = CRUDLoanApplication(LoanApplication)
