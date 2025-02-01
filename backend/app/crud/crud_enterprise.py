from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.enterprise import Enterprise
from app.schemas.enterprise import EnterpriseCreate, EnterpriseUpdate

class CRUDEnterprise(CRUDBase[Enterprise, EnterpriseCreate, EnterpriseUpdate]):
    def get_by_registration_number(self, db: Session, registration_number: str) -> Optional[Enterprise]:
        return db.query(self.model).filter(self.model.registration_number == registration_number).first()

    def get_by_name(self, db: Session, name: str) -> List[Enterprise]:
        return db.query(self.model).filter(self.model.name.ilike(f"%{name}%")).all()

crud_enterprise = CRUDEnterprise(Enterprise)
