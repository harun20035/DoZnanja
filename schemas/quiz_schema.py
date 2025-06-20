from pydantic import BaseModel
from typing import Optional

class QuizCreate(BaseModel):
    course_id: int
    title: str
    description: str
