from sqlmodel import Session
from models.user_model import User
from schemas.user_schema import UserCreate
from passlib.context import CryptContext
from repositories import user_repository
from passlib.context import CryptContext
from repositories.user_repository import get_user_by_email, create_user_with_google
import requests
import os
from dotenv import load_dotenv
from models.user_model import Role

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

    return user_repository.create_user(db, user)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

def get_google_auth_url() -> str:
    return (
        "https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile"
    )

def handle_google_callback(code: str, session: Session) -> User:
    # Dobijanje access_tokena od Googlea
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_response = requests.post("https://oauth2.googleapis.com/token", data=token_data)
    token_json = token_response.json()
    access_token = token_json.get("access_token")

    if not access_token:
        raise Exception("Google token fetch failed")

    # Dobijanje korisničkih podataka
    userinfo = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    email = userinfo.get("email")
    google_id = userinfo.get("id")
    if not email or not google_id:
        raise Exception("Incomplete user data from Google")

    # Provjera da li korisnik već postoji
    user = get_user_by_email(session, email)
    if not user:
        # Kreiranje User objekta u servisu
        user = User(
            name=userinfo.get("given_name", ""),
            surname=userinfo.get("family_name", ""),
            username=email.split("@")[0],
            email=email,
            password_hash="",  # prazno jer Google login
            role=Role.USER,
            google_id=google_id
        )
        user = user_repository.create_user(session, user)  # Repozitorijum samo spašava

    return user


def get_user_summary(user: User):
    return {
        "username": user.username,
        "credits": user.credits
    }
