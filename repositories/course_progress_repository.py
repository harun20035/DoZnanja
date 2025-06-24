from sqlmodel import Session, select
from models.course_progress_model import CourseProgress

def mark_step_completed(session: Session, user_id: int, course_id: int, step_id: int):
    progress = session.exec(
        select(CourseProgress).where(
            CourseProgress.user_id == user_id,
            CourseProgress.course_id == course_id,
            CourseProgress.step_id == step_id
        )
    ).first()

    if progress:
        progress.completed = True
    else:
        progress = CourseProgress(
            user_id=user_id,
            course_id=course_id,
            step_id=step_id,
            completed=True
        )
        session.add(progress)

    session.commit()
    session.refresh(progress)
    return progress

def get_completed_steps(session: Session, user_id: int, course_id: int):
    return session.exec(
        select(CourseProgress.step_id).where(
            CourseProgress.user_id == user_id,
            CourseProgress.course_id == course_id,
            CourseProgress.completed == True
        )
    ).all()
