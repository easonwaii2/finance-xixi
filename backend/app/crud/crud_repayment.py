from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.repayment_plan import RepaymentPlan
from app.models.repayment_record import RepaymentRecord
from app.schemas.repayment import RepaymentPlanCreate, RepaymentPlanUpdate, RepaymentRecordCreate, RepaymentRecordUpdate

class CRUDRepaymentPlan(CRUDBase[RepaymentPlan, RepaymentPlanCreate, RepaymentPlanUpdate]):
    def get_by_loan_application(self, db: Session, loan_application_id: int) -> List[RepaymentPlan]:
        return db.query(self.model).filter(self.model.loan_application_id == loan_application_id).all()

    def get_overdue_plans(self, db: Session) -> List[RepaymentPlan]:
        return db.query(self.model).filter(self.model.status == 'overdue').all()

class CRUDRepaymentRecord(CRUDBase[RepaymentRecord, RepaymentRecordCreate, RepaymentRecordUpdate]):
    def get_by_plan(self, db: Session, repayment_plan_id: int) -> List[RepaymentRecord]:
        return db.query(self.model).filter(self.model.repayment_plan_id == repayment_plan_id).all()

crud_repayment_plan = CRUDRepaymentPlan(RepaymentPlan)
crud_repayment_record = CRUDRepaymentRecord(RepaymentRecord)
