from sqlalchemy.orm import Session
from models.course_model import Course

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
