from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class QuizResult(SQLModel, table=True):
    __tablename__ = "quiz_results"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    quiz_id: int = Field(foreign_key="quiz.id")
    course_id: int = Field(foreign_key="courses.id")
    score: int
    passed: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow) 