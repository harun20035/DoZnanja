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
        error_message = str(e).lower()
        if 'username' in error_message:
            raise HTTPException(status_code=400, detail='Email već postoji')
        elif 'email' in error_message:
            raise HTTPException(status_code=400, detail='Korisničko ime već postoji')
        else:
            raise HTTPException(status_code=400, detail='Greška pri registraciji')


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
        google_auth_url = (
            "https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={GOOGLE_CLIENT_ID}&"
            f"redirect_uri={REDIRECT_URI}&"
            f"response_type=code&"
            f"scope=openid%20email%20profile"
        )
        return RedirectResponse(url=google_auth_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/google/callback", name="google_callback")
def google_callback(code: str, db: SessionDep):
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    access_token = token_json.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Google token fetch failed")

    userinfo_response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_info = userinfo_response.json()

    email = user_info.get("email")
    name = user_info.get("given_name")
    surname = user_info.get("family_name")
    google_id = user_info.get("id")

    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Incomplete user data from Google")

    # Provjera postoji li već korisnik
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Novi korisnik – registruj ga
        user = User(
            name=name,
            surname=surname,
            username=email.split("@")[0],  # basic username
            email=email,
            password_hash="",  # prazno jer koristi Google login
            role=Role.USER,
            google_id=google_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Token za sesiju
    access_token = create_access_token(data={"sub": user.id})

    # Preusmjeravanje korisnika na željenu rutu (dashboard)
    return RedirectResponse(url="http://localhost:3000/login/dashboard", status_code=303)

