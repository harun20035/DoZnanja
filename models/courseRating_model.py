from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class CourseRating(SQLModel, table=True):

    __tablename__ = 'course_ratings'

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    rating: int
    comment: str
    created_at: datetime
