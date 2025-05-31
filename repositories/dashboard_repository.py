from sqlalchemy.orm import Session
from models.course_model import Course
from sqlmodel import Session, select
from typing import List
from sqlalchemy import select
from models.courseEnrollment_model import CourseEnrollment
from models.user_model import User
from fastapi import HTTPException


def get_all_courses(db: Session) -> List[Course]:
    statement = select(Course)
    results = db.execute(statement).scalars()
    return results.all()


def get_user_courses_from_db(db: Session, user_id: int):
    try:
        # Povezivanje sa svim tablicama
        courses = db.query(Course, User.username.label("creator_name")).\
            join(User, Course.creator_id == User.id).\
            join(CourseEnrollment, CourseEnrollment.course_id == Course.id).\
            filter(CourseEnrollment.user_id == user_id).all()

        # Ispis za debagiranje
        print("Dohvaćeni kursevi:", courses)

        # Mapiranje rezultata, sada ispravno pristupamo tuple-u
        return [{
            "id": course[0].id,  # Pristupamo Course objektu
            "title": course[0].title,
            "creator_name": course.creator_name,  # Ime kreatora iz User modela
            "category": course[0].category,
            "description": course[0].description,
            "image_thumbnail": course[0].image_thumbnail,
            "average_rating": course[0].average_rating,
        } for course in courses]

    except Exception as e:
        print(f"Greška pri dohvaćanju kurseva: {str(e)}")  # Ispis greške
        raise HTTPException(status_code=500, detail=f"Error retrieving courses: {str(e)}")


