from typing import List, Optional
from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User
from app.models.approval_record import ApprovalRecord
from app.crud import crud_user

class NotificationService:
    @staticmethod
    async def notify_approvers(
        background_tasks: BackgroundTasks,
        db: Session,
        approval_record: ApprovalRecord,
        approver_ids: List[int]
    ):
        """Notify approvers about a new pending approval"""
        approvers = db.query(User).filter(User.id.in_(approver_ids)).all()
        for approver in approvers:
            background_tasks.add_task(
                NotificationService._send_approval_notification,
                approver.email,
                approval_record
            )

    @staticmethod
    async def notify_status_update(
        background_tasks: BackgroundTasks,
        db: Session,
        approval_record: ApprovalRecord,
        status: str
    ):
        """Notify relevant parties about an approval status update"""
        # Get the loan application owner
        loan_application = approval_record.loan_application
        enterprise = loan_application.enterprise
        
        # Notify enterprise contact
        if enterprise.contact_email:
            background_tasks.add_task(
                NotificationService._send_status_notification,
                enterprise.contact_email,
                status,
                loan_application.id
            )

    @staticmethod
    async def _send_approval_notification(email: str, approval_record: ApprovalRecord):
        """Send approval notification email"""
        # In a real implementation, this would use an email service
        # For now, we'll just print to console for demonstration
        print(f"[Notification] New approval task for {email}: Application #{approval_record.loan_application_id}")

    @staticmethod
    async def _send_status_notification(email: str, status: str, application_id: int):
        """Send status update notification email"""
        # In a real implementation, this would use an email service
        print(f"[Notification] Application #{application_id} status updated to {status}")

notification_service = NotificationService()
