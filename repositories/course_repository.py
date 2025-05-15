from sqlalchemy.orm import Session
from models.course_model import Course
from models.user_model import User

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def get_user(session: Session, user_id: int) -> User | None:
  return session.get(User, user_id)
