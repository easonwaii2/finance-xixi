from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_commission import crud_commission
from app.schemas.commission import CommissionRecord, CommissionRecordCreate, CommissionRecordUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[CommissionRecord])
def read_commission_records(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view commission records"
        )
    commission_records = crud_commission.get_multi(db, skip=skip, limit=limit)
    return commission_records

@router.post("/", response_model=CommissionRecord)
def create_commission_record(
    *,
    db: Session = Depends(deps.get_db),
    commission_record_in: CommissionRecordCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create commission records"
        )
    commission_record = crud_commission.create(db, obj_in=commission_record_in)
    return commission_record

@router.put("/{commission_record_id}", response_model=CommissionRecord)
def update_commission_record(
    *,
    db: Session = Depends(deps.get_db),
    commission_record_id: int,
    commission_record_in: CommissionRecordUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update commission records"
        )
    commission_record = crud_commission.get(db, id=commission_record_id)
    if not commission_record:
        raise HTTPException(
            status_code=404,
            detail="Commission record not found"
        )
    commission_record = crud_commission.update(
        db, db_obj=commission_record, obj_in=commission_record_in
    )
    return commission_record

@router.get("/salesperson/{salesperson_id}", response_model=List[CommissionRecord])
def read_salesperson_commissions(
    *,
    db: Session = Depends(deps.get_db),
    salesperson_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"] and current_user.id != salesperson_id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view these commission records"
        )
    commission_records = crud_commission.get_by_salesperson(db, salesperson_id=salesperson_id)
    return commission_records

@router.get("/status/{status}", response_model=List[CommissionRecord])
def read_commissions_by_status(
    *,
    db: Session = Depends(deps.get_db),
    status: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to filter commission records by status"
        )
    commission_records = crud_commission.get_by_status(db, status=status)
    return commission_records
