from repositories import admin_repository
from sqlmodel import Session
from repositories import admin_repository
from models.user_model import User
from models.course_model import Course
from models.courseStep_model import CourseStep
from fastapi import HTTPException
from utils.email_utils import send_course_status_email



def get_all_admin_data(db: Session):
    users = admin_repository.get_all_users(db)
    pending_courses = admin_repository.get_pending_courses(db)
    steps = admin_repository.get_all_course_steps(db)

    return {
        "users": [user.dict() for user in users],
        "courses": [course.dict() for course in pending_courses],
        "course_steps": [step.dict() for step in steps]
    }


def update_course_status(db: Session, course_id: int, new_status: str):
    course = admin_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Kurs nije pronađen")

    if new_status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Nevalidan status")

    course.status = new_status
    db.commit()
    db.refresh(course)

    creator = admin_repository.get_user_by_id(db, course.creator_id)
    if creator and creator.email:
        send_course_status_email(creator.email, course.title, new_status)
    return {"message": f"Status kursa promijenjen u {new_status}"}
