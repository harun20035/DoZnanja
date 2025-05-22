from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from database import engine
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import course_service
from services import course_service


router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session
        

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/all-courses")
def get_all_courses(db: SessionDep):
    return course_service.fetch_all_courses(db)