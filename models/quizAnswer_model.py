from sqlmodel import SQLModel, Field
from typing import Optional

class QuizAnswer(SQLModel, table=True):

    __tablename__ = 'quiz_answers'

    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id")
    user_id: int = Field(foreign_key="user.id")
    question_id: int = Field(foreign_key="quizquestion.id")
    answer_given: str
    is_correct: bool
