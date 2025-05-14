from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, Request
from schemas.user_schema import UserCreate, UserLogin
from services.user_service import create_user, verify_password
from fastapi.responses import RedirectResponse
from database import engine
from models.user_model import User, Role
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
import os
import requests

# Učitavanje .env
load_dotenv()

# Konstante iz .env
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Inicijalizacija ruta i lozinki
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Session dependency
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# JWT token kreacija
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# === Auth rute ===

@router.post("/register")
def register_user(user_data: UserCreate, db: SessionDep):
    try:
        user = create_user(user_data, db)
        return {"message": "User created", "user_id": user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login_user(user_data: UserLogin, db: SessionDep):
    user = db.query(User).filter(User.email == user_data.email).first()
    if user is None or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

# === Google OAuth2 login ===

@router.get("/google/login")
async def google_login():
    try:
        return RedirectResponse(url=get_google_auth_url())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/google/callback")
def google_callback(code: str, session: Session = Depends(get_session)):
    try:
        user = handle_google_callback(code, session)
        access_token = create_access_token(data={"sub": str(user.id)})
        return RedirectResponse(
            url="http://localhost:3000/login/dashboard",
            status_code=303,
            headers={"Authorization": f"Bearer {access_token}"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

