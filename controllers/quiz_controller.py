from fastapi import APIRouter, Depends, HTTPException, Body
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
    from models.quiz_option_model import QuizOption

    quizzes = db.query(Quiz).filter(Quiz.course_id == course_id).all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="Kviz ne postoji")

    for quiz in quizzes:
        questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id).all()
        for question in questions:
            db.query(QuizOption).filter(QuizOption.question_id == question.id).delete()
            db.delete(question)
        db.delete(quiz)
    db.commit()

    return {"message": "Kviz i pitanja su uspješno obrisani"}

@router.get("/by-course/{course_id}")
def get_quiz_by_course(course_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    from models.quiz_model import Quiz
    quiz = db.query(Quiz).filter(Quiz.course_id == course_id).order_by(Quiz.id.desc()).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Kviz ne postoji za ovaj kurs")
    return quiz

@router.get("/questions/{quiz_id}")
def get_quiz_questions(quiz_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    from models.quizQuestion_model import QuizQuestion
    from models.quiz_option_model import QuizOption
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    result = []
    for q in questions:
        options = db.query(QuizOption).filter(QuizOption.question_id == q.id).all()
        result.append({
            "id": q.id,
            "question_text": q.question_text,
            "options": [{"id": o.id, "text": o.text} for o in options]
        })
    return result

@router.post("/answer/bulk")
def submit_quiz_answers(
    db: SessionDep,
    answers: list[dict] = Body(...),
    current_user: User = Depends(get_current_user)
):
    from models.quizAnswer_model import QuizAnswer
    from models.quiz_option_model import QuizOption
    from models.quizResult_model import QuizResult
    from models.quiz_model import Quiz

    correct_count = 0
    quiz_id = None
    course_id = None
    for ans in answers:
        # Proveri da li je izabrana opcija tačna
        option = db.query(QuizOption).filter(QuizOption.id == int(ans["answer_given"])).first()
        is_correct = option.is_correct if option else False

        quiz_answer = QuizAnswer(
            course_id=ans["course_id"],
            user_id=ans["user_id"],
            question_id=ans["question_id"],
            answer_given=str(ans["answer_given"]),
            is_correct=is_correct
        )
        db.add(quiz_answer)
        if is_correct:
            correct_count += 1
        # Zapamti quiz_id i course_id iz prvog odgovora
        if quiz_id is None:
            # Pronađi quiz_id na osnovu question_id
            from models.quizQuestion_model import QuizQuestion
            question = db.query(QuizQuestion).filter(QuizQuestion.id == ans["question_id"]).first()
            if question:
                quiz_id = question.quiz_id
        if course_id is None:
            course_id = ans["course_id"]
    db.commit()
    passed = correct_count == len(answers)

    # Upisi rezultat u quiz_results
    if quiz_id and course_id:
        quiz_result = QuizResult(
            user_id=current_user.id,
            quiz_id=quiz_id,
            course_id=course_id,
            score=correct_count,
            passed=passed
        )
        db.add(quiz_result)
        db.commit()

    return {"passed": passed, "score": correct_count}

@router.get("/result/by-course/{course_id}")
def get_quiz_result_by_course(
    course_id: int,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    from models.quizResult_model import QuizResult
    result = db.query(QuizResult).filter(
        QuizResult.course_id == course_id,
        QuizResult.user_id == current_user.id
    ).order_by(QuizResult.timestamp.desc()).first()
    if not result:
        return {"exists": False}
    return {
        "exists": True,
        "passed": result.passed,
        "score": result.score,
        "timestamp": result.timestamp
    }
