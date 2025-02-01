from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.approval_record import ApprovalRecord
from app.schemas.approval_record import ApprovalRecordCreate, ApprovalRecordUpdate

class CRUDApprovalRecord(CRUDBase[ApprovalRecord, ApprovalRecordCreate, ApprovalRecordUpdate]):
    def get_by_loan_application(self, db: Session, loan_application_id: int) -> List[ApprovalRecord]:
        return db.query(self.model).filter(self.model.loan_application_id == loan_application_id).all()

    def get_by_approver(self, db: Session, approver_id: int) -> List[ApprovalRecord]:
        return db.query(self.model).filter(self.model.approver_id == approver_id).all()

    def get_pending_approvals(self, db: Session, approver_id: int) -> List[ApprovalRecord]:
        return db.query(self.model).filter(
            self.model.approver_id == approver_id,
            self.model.status == 'pending'
        ).all()

crud_approval_record = CRUDApprovalRecord(ApprovalRecord)
