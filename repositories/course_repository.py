from sqlalchemy.orm import Session
from models.course_model import Course
from models.courseStep_model import CourseStep
from sqlmodel import Session, select
from typing import List
from models.user_model import User
from fastapi import HTTPException
from schemas.course_schema import UserUpdate
from sqlalchemy import select

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_all_courses(db: Session) -> List[Course]:
    statement = select(Course)
    results = db.execute(statement).scalars()
    return results.all()


def r_update_user(db: Session, user_data: UserUpdate, current_user: User):
    user_db = db.query(User).filter(User.id == current_user.id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    if user_data.username is not None:
        if user_data.username != user_db.username:
            existing_user = db.query(User).filter(User.username == user_data.username).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Korisničko ime je već zauzeto")
        user_db.username = user_data.username

    if user_data.email is not None:
        if user_data.email != user_db.email:
            existing_user = db.query(User).filter(User.email == user_data.email).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Email adresa je već zauzeta")
        user_db.email = user_data.email 

    if user_data.name is not None:
        user_db.name = user_data.name
    if user_data.surname is not None:
        user_db.surname = user_data.surname

    db.commit()
    db.refresh(user_db)
    return user_db


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