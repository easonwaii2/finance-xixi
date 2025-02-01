from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.commission_record import CommissionRecord
from app.schemas.commission import CommissionRecordCreate, CommissionRecordUpdate

class CRUDCommission(CRUDBase[CommissionRecord, CommissionRecordCreate, CommissionRecordUpdate]):
    def get_by_salesperson(self, db: Session, salesperson_id: int) -> List[CommissionRecord]:
        return db.query(self.model).filter(self.model.salesperson_id == salesperson_id).all()

    def get_by_status(self, db: Session, status: str) -> List[CommissionRecord]:
        return db.query(self.model).filter(self.model.status == status).all()

crud_commission = CRUDCommission(CommissionRecord)
