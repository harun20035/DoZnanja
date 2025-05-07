from sqlmodel import SQLModel, Field
from typing import Optional

class QuizQuestion(SQLModel, table=True):

    __tablename__ = 'quiz_questions'

    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: int = Field(foreign_key="quiz.id")
    question_text: str
