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
        
        print("Dohvaćeni kursevi:", courses)  # Dodaj log za debagiranje
        return courses
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def get_top_courses(db : Session) :
    return dashboard_repository.get_top_courses_from_db(db)


def add_course_to_cart(db : Session, course_id : int, user_id : int) :
    dashboard_repository.add_course_to_cart(db, course_id, user_id)

    return {"message": "Kurs uspjesno dodan u korpu."}



def get_cart_count(db : Session, user_id: int) -> int:
    return dashboard_repository.count_cart_items(db, user_id)


def get_cart_courses(db : Session, user_id : int) :
    return dashboard_repository.get_user_cart_courses(db, user_id)


def purchase_course(course_id : int, db : Session, user_id : int) :
    return dashboard_repository.purchase_course(course_id, db, user_id)