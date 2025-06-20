from sqlalchemy.orm import Session
from repositories.quiz_repository import create_quiz_repository
from schemas.quiz_schema import QuizCreate

def create_quiz_service(db: Session, quiz_data: QuizCreate):
    return create_quiz_repository(db, quiz_data.dict())
