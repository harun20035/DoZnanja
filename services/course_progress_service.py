from sqlmodel import Session
from repositories.course_progress_repository import mark_step_completed, get_completed_steps

def complete_step_service(session: Session, user_id: int, course_id: int, step_id: int):
    return mark_step_completed(session, user_id, course_id, step_id)

def get_completed_steps_service(session: Session, user_id: int, course_id: int):
    return get_completed_steps(session, user_id, course_id)
