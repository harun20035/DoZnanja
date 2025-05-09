from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends
from fastapi import APIRouter, HTTPException
from schemas.user_schema import UserCreate
from services.user_service import create_user
from database import engine
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from models.user_model import User
from services.user_service import verify_password
from schemas.user_schema import UserLogin
from datetime import timedelta
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

# Tvoj tajni ključ, koristi nešto sigurno u produkciji
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt




router = APIRouter()



def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]





@router.post("/register")
def register_user(user_data: UserCreate, db: SessionDep):
    try:
        user = create_user(user_data, db)
        return {"message": "User created", "user_id": user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    


# Funkcija koja proverava korisničko ime i lozinku
@router.post("/login")
def login_user(user_data: UserLogin, db: SessionDep):
    user = db.query(User).filter(User.email == user_data.email).first()
    if user is None or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Kreiraj JWT token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.id}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}



