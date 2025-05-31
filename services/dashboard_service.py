from sqlalchemy.orm import Session
from repositories import course_repository
from sqlmodel import Session, select
from sqlmodel import Session
from typing import List
from repositories import course_repository, dashboard_repository
from models.user_model import User
from fastapi import HTTPException




def fetch_all_courses(db: Session) -> List[dict]:
    courses = course_repository.get_all_courses(db)
    return [course.dict() for course in courses]


def user_courses(db: Session, current_user: User):
    try: 
        # Dohvaćanje kurseva pomoću repository funkcije
        courses = dashboard_repository.get_user_courses_from_db(db, current_user.id)
        
        if not courses:
            raise HTTPException(status_code=404, detail="No courses found for this user")
        
        return courses
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")