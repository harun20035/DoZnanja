from sqlalchemy.orm import Session
from models.user_model import User
from schemas.user_schema import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user_data: UserCreate, db: Session):
    hashed_password = pwd_context.hash(user_data.password)
    user = User(
        name=user_data.name,
        surname=user_data.surname,
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
