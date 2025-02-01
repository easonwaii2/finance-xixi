from typing import List, Protocol
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_approval_record
from app.models.user import User
from app.schemas.approval_record import ApprovalRecordCreate, ApprovalRecordUpdate, ApprovalRecord

class NotificationService(Protocol):
    async def notify_status_update(
        self,
        background_tasks: BackgroundTasks,
        db: Session,
        approval_record: ApprovalRecord,
        status: str
    ) -> None:
        """Notify relevant parties about an approval status update"""
        pass

def get_notification_service() -> NotificationService:
    """Get notification service implementation"""
    from app.core.config import settings
    from app.services.notification_service import get_notification_service_impl
    return get_notification_service_impl()

router = APIRouter()

@router.get("/{application_id}/details", response_model=ApprovalRecord)
def get_approval_details(
    application_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get detailed information about an approval process"""
    approval = crud_approval_record.get_by_loan_application(db, loan_application_id=application_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval record not found")
    return approval[0] if approval else None

@router.post("/{application_id}/approve")
def approve_application(
    application_id: int,
    comments: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Approve a loan application"""
    approvals = crud_approval_record.get_by_loan_application(db, loan_application_id=application_id)
    if not approvals:
        raise HTTPException(status_code=404, detail="Approval record not found")
    
    approval = approvals[0]
    if approval.status != "pending":
        raise HTTPException(status_code=400, detail="Application is not in pending state")
    
    update_data = ApprovalRecordUpdate(
        status="approved",
        comments=comments,
        approver_id=current_user.id
    )
    
    updated_approval = crud_approval_record.update_status(
        db,
        db_obj=approval,
        status="approved",
        comments=comments,
        approver_id=current_user.id
    )
    
    # Send notifications
    notification_svc = Depends(get_notification_service)
    await notification_svc.notify_status_update(
        background_tasks,
        db,
        updated_approval,
        "approved"
    )
    
    return {"status": "success", "message": "Application approved successfully"}

@router.post("/{application_id}/reject")
def reject_application(
    application_id: int,
    comments: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Reject a loan application"""
    approvals = crud_approval_record.get_by_loan_application(db, loan_application_id=application_id)
    if not approvals:
        raise HTTPException(status_code=404, detail="Approval record not found")
    
    approval = approvals[0]
    if approval.status != "pending":
        raise HTTPException(status_code=400, detail="Application is not in pending state")
    
    updated_approval = crud_approval_record.update_status(
        db,
        db_obj=approval,
        status="rejected",
        comments=comments,
        approver_id=current_user.id
    )
    
    # Send notifications
    notification_svc = Depends(get_notification_service)
    await notification_svc.notify_status_update(
        background_tasks,
        db,
        updated_approval,
        "rejected"
    )
    
    return {"status": "success", "message": "Application rejected successfully"}

@router.get("/pending", response_model=List[ApprovalRecord])
def get_pending_approvals(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get list of pending approvals"""
    return crud_approval_record.get_pending_approvals(db, approver_id=current_user.id)

@router.get("/history/{application_id}", response_model=List[ApprovalRecord])
def get_approval_history(
    application_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Get approval history for a specific application"""
    return crud_approval_record.get_by_loan_application(db, loan_application_id=application_id)
