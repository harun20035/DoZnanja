from models.quiz_model import Quiz
from sqlalchemy.orm import Session

def create_quiz_repository(db: Session, quiz_data: dict) -> Quiz:
    quiz = Quiz(**quiz_data)
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz
