from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_repayment import crud_repayment_plan, crud_repayment_record
from app.schemas.repayment import (
    RepaymentPlan, RepaymentPlanCreate, RepaymentPlanUpdate,
    RepaymentRecord, RepaymentRecordCreate, RepaymentRecordUpdate
)
from app.models.user import User

router = APIRouter()

@router.get("/plans/", response_model=List[RepaymentPlan])
def read_repayment_plans(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view repayment plans"
        )
    repayment_plans = crud_repayment_plan.get_multi(db, skip=skip, limit=limit)
    return repayment_plans

@router.post("/plans/", response_model=RepaymentPlan)
def create_repayment_plan(
    *,
    db: Session = Depends(deps.get_db),
    repayment_plan_in: RepaymentPlanCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create repayment plans"
        )
    repayment_plan = crud_repayment_plan.create(db, obj_in=repayment_plan_in)
    return repayment_plan

@router.get("/plans/loan/{loan_application_id}", response_model=List[RepaymentPlan])
def read_loan_repayment_plans(
    *,
    db: Session = Depends(deps.get_db),
    loan_application_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    repayment_plans = crud_repayment_plan.get_by_loan_application(
        db, loan_application_id=loan_application_id
    )
    return repayment_plans

@router.get("/plans/overdue", response_model=List[RepaymentPlan])
def read_overdue_plans(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view overdue plans"
        )
    repayment_plans = crud_repayment_plan.get_overdue_plans(db)
    return repayment_plans

@router.put("/plans/{repayment_plan_id}", response_model=RepaymentPlan)
def update_repayment_plan(
    *,
    db: Session = Depends(deps.get_db),
    repayment_plan_id: int,
    repayment_plan_in: RepaymentPlanUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update repayment plans"
        )
    repayment_plan = crud_repayment_plan.get(db, id=repayment_plan_id)
    if not repayment_plan:
        raise HTTPException(
            status_code=404,
            detail="Repayment plan not found"
        )
    repayment_plan = crud_repayment_plan.update(
        db, db_obj=repayment_plan, obj_in=repayment_plan_in
    )
    return repayment_plan

@router.post("/records/", response_model=RepaymentRecord)
def create_repayment_record(
    *,
    db: Session = Depends(deps.get_db),
    repayment_record_in: RepaymentRecordCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create repayment records"
        )
    repayment_record = crud_repayment_record.create(db, obj_in=repayment_record_in)
    return repayment_record

@router.get("/records/plan/{repayment_plan_id}", response_model=List[RepaymentRecord])
def read_plan_repayment_records(
    *,
    db: Session = Depends(deps.get_db),
    repayment_plan_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view repayment records"
        )
    repayment_records = crud_repayment_record.get_by_plan(
        db, repayment_plan_id=repayment_plan_id
    )
    return repayment_records
