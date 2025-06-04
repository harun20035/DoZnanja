from sqlalchemy.orm import Session
from models.course_model import Course
from models.courseStep_model import CourseStep
from sqlmodel import Session, select
from typing import List, Optional
from models.user_model import User
from fastapi import HTTPException
from schemas.course_schema import UserUpdate
from sqlalchemy import select, func
from models.courseEnrollment_model import CourseEnrollment

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_all_courses(db: Session) -> List[Course]:
    statement = select(Course)
    results = db.execute(statement).scalars()
    return results.all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def update_user(db: Session, user: User):
    db.commit()
    db.refresh(user)
    return user



def change_password(db : Session, user : User):
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Lozinka uspješno promijenjena"}


def change_photo(db : Session, user : User) :
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Slika uspješno promijenjena"}

def get_creator_courses(db: Session, creator_id: int):
    statement = select(Course).where(Course.creator_id == creator_id)
    result = db.execute(statement)
    courses = result.scalars().all() 
    return courses


def create_step(db: Session, step: CourseStep):
    db.add(step)
    db.commit()
    db.refresh(step)
    return {"message": "Step uspješno napravljen"}

def get_step(db:Session,course_id:int):
    statement = select(CourseStep).where(CourseStep.course_id == course_id)
    result = db.execute(statement)
    steps = result.scalars().all()
    return steps

def get_step_delete(db: Session, step_id: int):
    return db.query(CourseStep).filter(CourseStep.id == step_id).first()


def delete_step(db:Session,step:CourseStep):
    db.delete(step)
    db.commit()


def update_step_course(db : Session, step : CourseStep) :
    db.add(step)
    db.commit()
    db.refresh(step)

    return {"message" : "Step uspjesno azuriran"}


def get_course_by_id(session: Session, course_id: int) -> Optional[Course]:
    statement = select(Course).where(Course.id == course_id)
    return session.exec(statement).first()



def get_courses_with_stats(db: Session, creator_id: int):
    courses = db.execute(
        select(Course).where(Course.creator_id == creator_id)
    ).scalars().all()

    result = []

    for course in courses:
        students_count = db.scalar(
            select(func.count()).select_from(CourseEnrollment).where(CourseEnrollment.course_id == course.id)
        ) or 0

        revenue = round(students_count * course.price * 0.8, 2)

        result.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "image_thumbnail": course.image_thumbnail,
            "status": course.status,
            "created_at": course.created_at,
            "students": students_count,
            "average_rating": round(course.average_rating or 0, 1),
            "revenue": revenue  # brojčano, frontend ga formatira
        })

    return result

