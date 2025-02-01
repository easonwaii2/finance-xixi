from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud.crud_loan_product import crud_loan_product
from app.schemas.loan_product import LoanProduct, LoanProductCreate, LoanProductUpdate
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[LoanProduct])
def read_loan_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_products = crud_loan_product.get_multi(db, skip=skip, limit=limit)
    return loan_products

@router.get("/active", response_model=List[LoanProduct])
def read_active_loan_products(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_products = crud_loan_product.get_active(db)
    return loan_products

@router.post("/", response_model=LoanProduct)
def create_loan_product(
    *,
    db: Session = Depends(deps.get_db),
    loan_product_in: LoanProductCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create loan products"
        )
    loan_product = crud_loan_product.create(db, obj_in=loan_product_in)
    return loan_product

@router.put("/{loan_product_id}", response_model=LoanProduct)
def update_loan_product(
    *,
    db: Session = Depends(deps.get_db),
    loan_product_id: int,
    loan_product_in: LoanProductUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update loan products"
        )
    loan_product = crud_loan_product.get(db, id=loan_product_id)
    if not loan_product:
        raise HTTPException(
            status_code=404,
            detail="Loan product not found"
        )
    loan_product = crud_loan_product.update(db, db_obj=loan_product, obj_in=loan_product_in)
    return loan_product

@router.get("/{loan_product_id}", response_model=LoanProduct)
def read_loan_product(
    *,
    db: Session = Depends(deps.get_db),
    loan_product_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    loan_product = crud_loan_product.get(db, id=loan_product_id)
    if not loan_product:
        raise HTTPException(
            status_code=404,
            detail="Loan product not found"
        )
    return loan_product

@router.delete("/{loan_product_id}", response_model=LoanProduct)
def delete_loan_product(
    *,
    db: Session = Depends(deps.get_db),
    loan_product_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to delete loan products"
        )
    loan_product = crud_loan_product.get(db, id=loan_product_id)
    if not loan_product:
        raise HTTPException(
            status_code=404,
            detail="Loan product not found"
        )
    loan_product = crud_loan_product.remove(db, id=loan_product_id)
    return loan_product
