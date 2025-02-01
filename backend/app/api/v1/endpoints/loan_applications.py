from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_loan_application import crud_loan_application
from app.schemas.loan_application import LoanApplication, LoanApplicationCreate, LoanApplicationUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[LoanApplication])
def read_loan_applications(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role == "business":
        loan_applications = crud_loan_application.get_by_salesperson(db, salesperson_id=current_user.id)
    else:
        loan_applications = crud_loan_application.get_multi(db, skip=skip, limit=limit)
    return loan_applications

@router.post("/", response_model=LoanApplication)
def create_loan_application(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_in: LoanApplicationCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create loan applications"
        )
    loan_application = crud_loan_application.create(
        db, 
        obj_in=loan_application_in
    )
    return loan_application

@router.put("/{loan_application_id}", response_model=LoanApplication)
def update_loan_application(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_id: int,
    loan_application_in: LoanApplicationUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_application = crud_loan_application.get(db, id=loan_application_id)
    if not loan_application:
        raise HTTPException(
            status_code=404,
            detail="Loan application not found"
        )
    if current_user.role not in ["admin", "business"] and loan_application.salesperson_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update this loan application"
        )
    loan_application = crud_loan_application.update(
        db, 
        db_obj=loan_application,
        obj_in=loan_application_in
    )
    return loan_application

@router.get("/{loan_application_id}", response_model=LoanApplication)
def read_loan_application(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_application = crud_loan_application.get(db, id=loan_application_id)
    if not loan_application:
        raise HTTPException(
            status_code=404,
            detail="Loan application not found"
        )
    if (current_user.role not in ["admin", "approver", "finance"] and 
        loan_application.salesperson_id != current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to read this loan application"
        )
    return loan_application

@router.get("/enterprise/{enterprise_id}", response_model=List[LoanApplication])
def read_enterprise_loan_applications(
    *,
    db: Session = Depends(deps.get_db),
    enterprise_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_applications = crud_loan_application.get_by_enterprise(db, enterprise_id=enterprise_id)
    return loan_applications

@router.get("/status/{status}", response_model=List[LoanApplication])
def read_loan_applications_by_status(
    *,
    db: Session = Depends(deps.get_db),
    status: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "approver", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to filter loan applications by status"
        )
    loan_applications = crud_loan_application.get_by_status(db, status=status)
    return loan_applications
