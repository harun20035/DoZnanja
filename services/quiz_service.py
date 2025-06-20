from sqlalchemy.orm import Session
from repositories.quiz_repository import create_quiz_repository
from schemas.quiz_schema import QuizCreate
from schemas.quiz_schema import QuizQuestionCreate
from repositories.quiz_repository import create_quiz_question_repository

def create_quiz_service(db: Session, quiz_data: QuizCreate):
    return create_quiz_repository(db, quiz_data.dict())


def create_quiz_question_service(db, question_data: QuizQuestionCreate):
    return create_quiz_question_repository(db, question_data)