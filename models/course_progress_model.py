from typing import Optional
from sqlmodel import SQLModel, Field

class CourseProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    course_id: int = Field(foreign_key="course.id")
    step_id: int = Field(foreign_key="step.id")
    completed: bool = Field(default=False)
