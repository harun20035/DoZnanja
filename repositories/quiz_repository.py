from models.quiz_model import Quiz
from sqlalchemy.orm import Session
from models.quizQuestion_model import QuizQuestion
from models.quiz_option_model import QuizOption

def create_quiz_repository(db: Session, quiz_data: dict) -> Quiz:
    quiz = Quiz(**quiz_data)
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz

def create_quiz_question_repository(db, question_data):
    question = QuizQuestion(
        quiz_id=question_data.quiz_id,
        question_text=question_data.question_text
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    # Dodaj opcije
    for opt in question_data.options:
        option = QuizOption(
            question_id=question.id,
            text=opt.text,
            is_correct=opt.is_correct
        )
        db.add(option)

    db.commit()
    return question

def create_quiz_question_repository(db, question_data):
    question = QuizQuestion(
        quiz_id=question_data.quiz_id,
        question_text=question_data.question_text
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    # Dodaj opcije
    for opt in question_data.options:
        option = QuizOption(
            question_id=question.id,
            text=opt.text,
            is_correct=opt.is_correct
        )
        db.add(option)

    db.commit()
    return question
