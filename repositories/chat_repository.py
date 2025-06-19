from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user_model import User
from models.course_model import Course
from models.courseEnrollment_model import CourseEnrollment

# Ako je USER — listaj kreatore čije je kurseve kupio
def get_chat_partners_for_user(db: Session, user_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            func.min(Course.title).label("course_title")  # samo jedan naslov
        )
        .join(Course, Course.creator_id == User.id)
        .join(CourseEnrollment, CourseEnrollment.course_id == Course.id)
        .filter(CourseEnrollment.user_id == user_id)
        .group_by(User.id)
        .all()
    )

# Ako je CREATOR — listaj korisnike koji su kupili njegove kurseve
def get_chat_partners_for_creator_students(db: Session, creator_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            func.min(Course.title).label("course_title")
        )
        .join(CourseEnrollment, CourseEnrollment.user_id == User.id)
        .join(Course, Course.id == CourseEnrollment.course_id)
        .filter(Course.creator_id == creator_id)
        .group_by(User.id)
        .all()
    )

# Ako je CREATOR — listaj kreatore čije je on kupio kurseve
def get_chat_partners_for_creator_purchased(db: Session, creator_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            func.min(Course.title).label("course_title")
        )
        .join(Course, Course.creator_id == User.id)
        .join(CourseEnrollment, CourseEnrollment.course_id == Course.id)
        .filter(CourseEnrollment.user_id == creator_id)
        .filter(User.id != creator_id)  # da ne uključimo sebe
        .group_by(User.id)
        .all()
    )
