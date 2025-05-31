from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from database import engine
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import course_service
from services import course_service
from controllers.course_controller import get_current_user
from models.user_model import User
from services import dashboard_service

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session
        

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/all-courses")
def get_all_courses(db: SessionDep):
    return course_service.fetch_all_courses(db)


@router.get("/user-courses")
def get_user_coursesdb(db : SessionDep, current_user : User = Depends(get_current_user)) :
    return dashboard_service.user_courses(db, current_user)


@router.get("/popular-courses") 
def popular_courses(db : SessionDep) :
    return dashboard_service.get_top_courses(db)