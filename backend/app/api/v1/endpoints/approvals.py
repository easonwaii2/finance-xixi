from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_approval_record import crud_approval_record
from app.crud.crud_loan_application import crud_loan_application
from app.schemas.approval_record import ApprovalRecord, ApprovalRecordCreate, ApprovalRecordUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ApprovalRecord])
def read_approval_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role == "approver":
        approval_records = crud_approval_record.get_by_approver(db, approver_id=current_user.id)
    elif current_user.role in ["admin", "finance"]:
        approval_records = crud_approval_record.get_multi(db, skip=skip, limit=limit)
    else:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view approval records"
        )
    return approval_records

@router.post("/loan-application/{loan_application_id}", response_model=ApprovalRecord)
def create_approval_record(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_id: int,
    approval_record_in: ApprovalRecordCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "approver"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create approval records"
        )
    loan_application = crud_loan_application.get(db, id=loan_application_id)
    if not loan_application:
        raise HTTPException(
            status_code=404,
            detail="Loan application not found"
        )
    approval_record = crud_approval_record.create(db, obj_in=approval_record_in)
    return approval_record

@router.put("/{approval_record_id}", response_model=ApprovalRecord)
def update_approval_record(
    *,
    db: Session = Depends(deps.get_db),
    approval_record_id: int,
    approval_record_in: ApprovalRecordUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    approval_record = crud_approval_record.get(db, id=approval_record_id)
    if not approval_record:
        raise HTTPException(
            status_code=404,
            detail="Approval record not found"
        )
    if current_user.role not in ["admin", "approver"] or (
        current_user.role == "approver" and approval_record.approver_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update this approval record"
        )
    approval_record = crud_approval_record.update(
        db, 
        db_obj=approval_record,
        obj_in=approval_record_in
    )
    return approval_record

@router.get("/pending", response_model=List[ApprovalRecord])
def read_pending_approvals(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "approver"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view pending approvals"
        )
    if current_user.role == "approver":
        approval_records = crud_approval_record.get_pending_approvals(db, approver_id=current_user.id)
    else:
        approval_records = crud_approval_record.get_by_status(db, status="pending")
    return approval_records

@router.get("/loan-application/{loan_application_id}", response_model=List[ApprovalRecord])
def read_loan_application_approvals(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "approver", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view loan application approvals"
        )
    approval_records = crud_approval_record.get_by_loan_application(db, loan_application_id=loan_application_id)
    return approval_records
