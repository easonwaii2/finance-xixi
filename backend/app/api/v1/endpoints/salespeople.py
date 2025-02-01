from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_salesperson import crud_salesperson
from app.schemas.salesperson import Salesperson, SalespersonCreate, SalespersonUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Salesperson])
def read_salespeople(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view salespeople"
        )
    salespeople = crud_salesperson.get_multi(db, skip=skip, limit=limit)
    return salespeople

@router.post("/", response_model=Salesperson)
def create_salesperson(
    *,
    db: Session = Depends(deps.get_db),
    salesperson_in: SalespersonCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create salespeople"
        )
    salesperson = crud_salesperson.create(db, obj_in=salesperson_in)
    return salesperson

@router.put("/{salesperson_id}", response_model=Salesperson)
def update_salesperson(
    *,
    db: Session = Depends(deps.get_db),
    salesperson_id: int,
    salesperson_in: SalespersonUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update salespeople"
        )
    salesperson = crud_salesperson.get(db, id=salesperson_id)
    if not salesperson:
        raise HTTPException(
            status_code=404,
            detail="Salesperson not found"
        )
    salesperson = crud_salesperson.update(db, db_obj=salesperson, obj_in=salesperson_in)
    return salesperson

@router.get("/region/{region}", response_model=List[Salesperson])
def read_salespeople_by_region(
    *,
    db: Session = Depends(deps.get_db),
    region: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view salespeople by region"
        )
    salespeople = crud_salesperson.get_by_region(db, region=region)
    return salespeople
