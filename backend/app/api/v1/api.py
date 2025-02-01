from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, loan_products, enterprises, loan_applications,
    approvals, repayments, salespeople, commissions, reports
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(loan_products.router, prefix="/loan-products", tags=["loan-products"])
api_router.include_router(enterprises.router, prefix="/enterprises", tags=["enterprises"])
api_router.include_router(loan_applications.router, prefix="/loan-applications", tags=["loan-applications"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["approvals"])
api_router.include_router(repayments.router, prefix="/repayments", tags=["repayments"])
api_router.include_router(salespeople.router, prefix="/salespeople", tags=["salespeople"])
api_router.include_router(commissions.router, prefix="/commissions", tags=["commissions"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
