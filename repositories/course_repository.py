from sqlalchemy.orm import Session
from models.course_model import Course
from sqlmodel import Session, select
from typing import List

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_all_courses(db: Session) -> List[Course]:
    statement = select(Course)
    results = db.execute(statement).scalars()
    return results.all()