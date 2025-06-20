# models/quiz_option_model.py
from sqlmodel import SQLModel, Field
from typing import Optional

class QuizOption(SQLModel, table=True):
    __tablename__ = "quiz_options"

    id: Optional[int] = Field(default=None, primary_key=True)
    question_id: int = Field(foreign_key="quiz_questions.id")
    text: str
    is_correct: bool
