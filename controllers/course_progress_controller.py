from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from schemas.course_progress_schema import StepProgressUpdate
from services.course_progress_service import complete_step_service, get_completed_steps_service

router = APIRouter(prefix="/progress", tags=["progress"])

@router.post("/complete")
def complete_step(data: StepProgressUpdate, session: Session = Depends(get_session)):
    return complete_step_service(session, data.user_id, data.course_id, data.step_id)

@router.get("/completed/{user_id}/{course_id}")
def get_completed(user_id: int, course_id: int, session: Session = Depends(get_session)):
    return get_completed_steps_service(session, user_id, course_id)
