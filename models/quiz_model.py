from sqlmodel import SQLModel, Field
from typing import Optional

class Quiz(SQLModel, table=True):
    __tablename__ = "quiz"

    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="courses.id")
    title: str
    description: str
