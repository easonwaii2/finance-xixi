from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.crud.base import CRUDBase
from app.models.approval_record import ApprovalRecord
from app.models.loan_application import LoanApplication
from app.schemas.approval_record import ApprovalRecordCreate, ApprovalRecordUpdate
from datetime import datetime

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
    
    def update_status(
        self, 
        db: Session, 
        *,
        db_obj: ApprovalRecord,
        status: str,
        comments: str,
        approver_id: int
    ) -> ApprovalRecord:
        update_data = {
            "status": status,
            "comments": comments,
            "approver_id": approver_id,
            "updated_at": datetime.utcnow()
        }
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_approval_chain(self, db: Session, loan_application_id: int) -> List[Dict[str, Any]]:
        records = db.query(
            self.model,
            LoanApplication
        ).join(
            LoanApplication,
            self.model.loan_application_id == LoanApplication.id
        ).filter(
            self.model.loan_application_id == loan_application_id
        ).order_by(self.model.created_at.asc()).all()

        return [{
            "id": record.ApprovalRecord.id,
            "status": record.ApprovalRecord.status,
            "comments": record.ApprovalRecord.comments,
            "approver_id": record.ApprovalRecord.approver_id,
            "created_at": record.ApprovalRecord.created_at,
            "loan_application": {
                "id": record.LoanApplication.id,
                "status": record.LoanApplication.status,
                "amount": record.LoanApplication.amount,
                "term_months": record.LoanApplication.term_months
            }
        } for record in records]

    def get_pending_by_level(self, db: Session, level: int) -> List[ApprovalRecord]:
        return db.query(self.model).filter(
            and_(
                self.model.status == 'pending',
                self.model.approval_level == level
            )
        ).all()

crud_approval_record = CRUDApprovalRecord(ApprovalRecord)
