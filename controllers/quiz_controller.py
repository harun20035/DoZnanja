from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from schemas.quiz_schema import QuizCreate, QuizQuestionCreate
from services.quiz_service import create_quiz_service, create_quiz_question_service
from models.user_model import User
from database import engine
import os, jwt
from typing import Annotated

router = APIRouter(prefix="/quiz", tags=["Quiz"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def get_current_user(db: SessionDep, token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/create")
def create_quiz_controller(
    quiz_data: QuizCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    try:
        quiz = create_quiz_service(db, quiz_data)
        return {"message": "Kviz kreiran", "quiz_id": quiz.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-question")
def create_question_controller(
    question_data: QuizQuestionCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    try:
        question = create_quiz_question_service(db, question_data)
        return {"message": "Pitanje spremljeno", "question_id": question.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/exists/{course_id}")
def check_quiz_exists(course_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    from models.quiz_model import Quiz
    existing_quiz = db.query(Quiz).filter(Quiz.course_id == course_id).first()
    return {"exists": existing_quiz is not None}


@router.delete("/delete/{course_id}")
def delete_quiz_and_questions(course_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    from models.quiz_model import Quiz
    from models.quizQuestion_model import QuizQuestion

    quiz = db.query(Quiz).filter(Quiz.course_id == course_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Kviz ne postoji")

    # Prvo obriši pitanja
    db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id).delete()

    # Zatim obriši kviz
    db.delete(quiz)
    db.commit()

    return {"message": "Kviz i pitanja su uspješno obrisani"}
