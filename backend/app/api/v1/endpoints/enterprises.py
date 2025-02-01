from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_enterprise import crud_enterprise
from app.schemas.enterprise import Enterprise, EnterpriseCreate, EnterpriseUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Enterprise])
def read_enterprises(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    enterprises = crud_enterprise.get_multi(db, skip=skip, limit=limit)
    return enterprises

@router.post("/", response_model=Enterprise)
def create_enterprise(
    *,
    db: Session = Depends(deps.get_db),
    enterprise_in: EnterpriseCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create enterprises"
        )
    existing = crud_enterprise.get_by_registration_number(db, registration_number=enterprise_in.registration_number)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Enterprise with this registration number already exists"
        )
    enterprise = crud_enterprise.create(db, obj_in=enterprise_in)
    return enterprise

@router.put("/{enterprise_id}", response_model=Enterprise)
def update_enterprise(
    *,
    db: Session = Depends(deps.get_db),
    enterprise_id: int,
    enterprise_in: EnterpriseUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update enterprises"
        )
    enterprise = crud_enterprise.get(db, id=enterprise_id)
    if not enterprise:
        raise HTTPException(
            status_code=404,
            detail="Enterprise not found"
        )
    enterprise = crud_enterprise.update(db, db_obj=enterprise, obj_in=enterprise_in)
    return enterprise

@router.get("/{enterprise_id}", response_model=Enterprise)
def read_enterprise(
    *,
    db: Session = Depends(deps.get_db),
    enterprise_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    enterprise = crud_enterprise.get(db, id=enterprise_id)
    if not enterprise:
        raise HTTPException(
            status_code=404,
            detail="Enterprise not found"
        )
    return enterprise

@router.get("/search/{name}", response_model=List[Enterprise])
def search_enterprises(
    *,
    db: Session = Depends(deps.get_db),
    name: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    enterprises = crud_enterprise.get_by_name(db, name=name)
    return enterprises
