from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.loan_product import LoanProduct
from app.schemas.loan_product import LoanProductCreate, LoanProductUpdate

class CRUDLoanProduct(CRUDBase[LoanProduct, LoanProductCreate, LoanProductUpdate]):
    def get_active(self, db: Session) -> List[LoanProduct]:
        return db.query(self.model).filter(self.model.is_active == True).all()

    def get_by_type(self, db: Session, product_type: str) -> List[LoanProduct]:
        return db.query(self.model).filter(self.model.product_type == product_type).all()

crud_loan_product = CRUDLoanProduct(LoanProduct)
