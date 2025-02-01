from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.api import deps
from app.models.user import User
from app.models.loan_application import LoanApplication
from app.models.repayment_plan import RepaymentPlan
from app.models.commission_record import CommissionRecord
from app.models.salesperson import Salesperson

router = APIRouter()

@router.get("/loan-statistics")
def get_loan_statistics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view loan statistics"
        )
    
    total_loans = db.query(func.count(LoanApplication.id)).scalar()
    total_amount = db.query(func.sum(LoanApplication.amount)).scalar() or 0
    approved_loans = db.query(func.count(LoanApplication.id)).filter(
        LoanApplication.status == "approved"
    ).scalar()
    rejected_loans = db.query(func.count(LoanApplication.id)).filter(
        LoanApplication.status == "rejected"
    ).scalar()

    return {
        "total_loans": total_loans,
        "total_amount": total_amount,
        "approved_loans": approved_loans,
        "rejected_loans": rejected_loans,
        "approval_rate": (approved_loans / total_loans * 100) if total_loans > 0 else 0
    }

@router.get("/repayment-statistics")
def get_repayment_statistics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view repayment statistics"
        )

    total_plans = db.query(func.count(RepaymentPlan.id)).scalar()
    paid_plans = db.query(func.count(RepaymentPlan.id)).filter(
        RepaymentPlan.status == "paid"
    ).scalar()
    overdue_plans = db.query(func.count(RepaymentPlan.id)).filter(
        RepaymentPlan.status == "overdue"
    ).scalar()

    return {
        "total_plans": total_plans,
        "paid_plans": paid_plans,
        "overdue_plans": overdue_plans,
        "payment_rate": (paid_plans / total_plans * 100) if total_plans > 0 else 0,
        "overdue_rate": (overdue_plans / total_plans * 100) if total_plans > 0 else 0
    }

@router.get("/sales-performance")
def get_sales_performance(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "business"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view sales performance"
        )

    salespeople = db.query(Salesperson).all()
    performance_data = []

    for sp in salespeople:
        loans = db.query(func.count(LoanApplication.id)).filter(
            LoanApplication.salesperson_id == sp.user_id
        ).scalar()
        
        loan_amount = db.query(func.sum(LoanApplication.amount)).filter(
            LoanApplication.salesperson_id == sp.user_id
        ).scalar() or 0
        
        commission = db.query(func.sum(CommissionRecord.amount)).filter(
            CommissionRecord.salesperson_id == sp.id,
            CommissionRecord.status == "paid"
        ).scalar() or 0

        performance_data.append({
            "salesperson_id": sp.id,
            "region": sp.region,
            "total_loans": loans,
            "total_loan_amount": loan_amount,
            "total_commission": commission,
            "target_achievement": (loan_amount / sp.target_amount * 100) if sp.target_amount > 0 else 0
        })

    return performance_data

@router.get("/monthly-report")
def get_monthly_report(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    if current_user.role not in ["admin", "finance"]:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view monthly report"
        )

    today = datetime.utcnow()
    start_of_month = datetime(today.year, today.month, 1)
    
    monthly_loans = db.query(func.count(LoanApplication.id)).filter(
        LoanApplication.created_at >= start_of_month
    ).scalar()
    
    monthly_loan_amount = db.query(func.sum(LoanApplication.amount)).filter(
        LoanApplication.created_at >= start_of_month
    ).scalar() or 0
    
    monthly_repayments = db.query(func.sum(RepaymentPlan.principal_amount + RepaymentPlan.interest_amount)).filter(
        RepaymentPlan.status == "paid",
        RepaymentPlan.updated_at >= start_of_month
    ).scalar() or 0
    
    monthly_commissions = db.query(func.sum(CommissionRecord.amount)).filter(
        CommissionRecord.status == "paid",
        CommissionRecord.payment_date >= start_of_month
    ).scalar() or 0

    return {
        "month": today.strftime("%Y-%m"),
        "new_loans": monthly_loans,
        "new_loan_amount": monthly_loan_amount,
        "total_repayments": monthly_repayments,
        "total_commissions": monthly_commissions
    }
