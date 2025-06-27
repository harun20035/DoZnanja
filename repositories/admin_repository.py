from models.user_model import User
from models.course_model import Course
from models.courseStep_model import CourseStep
from sqlmodel import Session, select
from models.course_model import Status

def get_all_users(db: Session):
    return db.exec(select(User)).all()

def get_all_courses(db: Session):
    return db.exec(select(Course)).all()

def get_all_course_steps(db: Session):
    return db.exec(select(CourseStep)).all()



def get_pending_courses(db: Session):
    statement = select(Course).where(Course.status == Status.PENDING)
    return db.exec(statement).all()


def get_course_by_id(db: Session, course_id: int):
    return db.exec(select(Course).where(Course.id == course_id)).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()
