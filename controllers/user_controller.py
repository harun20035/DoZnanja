from sqlalchemy.orm import Session
from typing import Annotated
from fastapi import Depends
from fastapi import APIRouter, HTTPException
from schemas.user_schema import UserCreate
from services.user_service import create_user
from database import engine

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter()

@router.post("/register")
def register_user(user_data: UserCreate, db: SessionDep):
    try:
        user = create_user(user_data, db)
        return {"message": "User created", "user_id": user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



