from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import Session
from database import engine
from models.user_model import User
from services import admin_service
from schemas.admin_schema import CourseStatusUpdate  




router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/pregled-svega")
def get_all_data(db: SessionDep):
    
    
    return admin_service.get_all_admin_data(db)


@router.put("/course-status/{course_id}")
def update_course_status(course_id: int, data: CourseStatusUpdate, db: SessionDep):
    return admin_service.update_course_status(db, course_id, data.new_status)