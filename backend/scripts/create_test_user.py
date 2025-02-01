import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.base import Base, engine
from app.models.user import User
from sqlalchemy.orm import Session
from app.core.security import get_password_hash

def create_test_user():
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        existing_user = session.query(User).filter(User.email == "admin@example.com").first()
        if not existing_user:
            admin_user = User(
                email="admin@example.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            session.add(admin_user)
            session.commit()
            print("Test user created successfully")
        else:
            print("Test user already exists")

if __name__ == "__main__":
    create_test_user()
