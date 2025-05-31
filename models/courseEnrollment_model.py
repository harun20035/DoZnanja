from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class CourseEnrollment(SQLModel, table=True):

    __tablename__ = 'course_enrollments'

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    course_id: int = Field(foreign_key="courses.id")
    enrolled_at: datetime
