from pydantic import BaseModel
from typing import Optional
from typing import List
from pydantic import BaseModel

class QuizCreate(BaseModel):
    course_id: int
    title: str
    description: str

class QuizOptionCreate(BaseModel):
    text: str
    is_correct: bool

class QuizQuestionCreate(BaseModel):
    quiz_id: int
    question_text: str
    options: List[QuizOptionCreate]