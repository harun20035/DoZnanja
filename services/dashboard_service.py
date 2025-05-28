from sqlalchemy.orm import Session
from repositories import course_repository
from sqlmodel import Session, select
from sqlmodel import Session
from typing import List
from repositories import course_repository




def fetch_all_courses(db: Session) -> List[dict]:
    courses = course_repository.get_all_courses(db)
    return [course.dict() for course in courses]