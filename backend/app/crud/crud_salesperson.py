from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.salesperson import Salesperson
from app.schemas.salesperson import SalespersonCreate, SalespersonUpdate

class CRUDSalesperson(CRUDBase[Salesperson, SalespersonCreate, SalespersonUpdate]):
    def get_by_user_id(self, db: Session, user_id: int) -> Optional[Salesperson]:
        return db.query(self.model).filter(self.model.user_id == user_id).first()

    def get_by_region(self, db: Session, region: str) -> List[Salesperson]:
        return db.query(self.model).filter(self.model.region == region).all()

crud_salesperson = CRUDSalesperson(Salesperson)
