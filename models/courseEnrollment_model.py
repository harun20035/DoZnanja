from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class CourseEnrollment(SQLModel, table=True):

    __tablename__ = 'course_enrollments'

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    enrolled_at: datetime
