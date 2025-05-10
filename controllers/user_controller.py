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
import os
from fastapi.responses import RedirectResponse
from fastapi import Request
from dotenv import load_dotenv
import requests
from models.user_model import Role
from fastapi import Request



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


load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


@router.get("/google/login")
async def google_login(request: Request):
    try:
        redirect_uri = request.url_for("google_callback")  # Koristite request.url_for
        print(f"Redirect URI: {redirect_uri}")  # Debug ispis
        
        google_auth_url = (
            "https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={GOOGLE_CLIENT_ID}&"
            f"redirect_uri={redirect_uri}&"
            f"response_type=code&"
            f"scope=openid%20email%20profile"
        )
        return RedirectResponse(url=google_auth_url)
    except Exception as e:
        print(f"Error in google_login: {str(e)}")
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

    # Provjera postoji li već user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Novi korisnik – registruj
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
    return {"access_token": access_token, "token_type": "bearer"}