import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.base import SessionLocal, Base, engine
from app.models.loan_product import LoanProduct

db = SessionLocal()

# Create test loan products
test_products = [
    {
        'name': '企业经营贷',
        'product_type': '经营贷款',
        'interest_rate': 4.5,
        'term_months': 12,
        'repayment_method': 'monthly',
        'min_amount': 100000,
        'max_amount': 1000000,
        'is_active': True
    },
    {
        'name': '企业设备贷',
        'product_type': '设备贷款',
        'interest_rate': 5.0,
        'term_months': 24,
        'repayment_method': 'monthly',
        'min_amount': 500000,
        'max_amount': 5000000,
        'is_active': True
    }
]

for product_data in test_products:
    product = LoanProduct(**product_data)
    db.add(product)

db.commit()
db.close()
