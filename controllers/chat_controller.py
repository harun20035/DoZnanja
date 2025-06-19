from fastapi import APIRouter, Depends,HTTPException
from typing import List
from sqlalchemy.orm import Session
from models.user_model import User
from services import chat_service
from database import engine
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import os, jwt
from sqlalchemy.orm import Session
from schemas.chat_schema import ChatPartnerResponse
from typing import List

router = APIRouter()

# Session i token setup
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(db: SessionDep, token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Glavna ruta za dohvat chat partnera
@router.get("/partners", response_model=List[ChatPartnerResponse])
def get_chat_partners(db: SessionDep, current_user: User = Depends(get_current_user)):
    return chat_service.get_available_chat_partners(db, current_user)
