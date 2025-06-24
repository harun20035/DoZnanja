from typing import Optional
from sqlmodel import SQLModel, Field

class CourseProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    course_id: int = Field(foreign_key="courses.id")
    step_id: int = Field(foreign_key="course_steps.id")
    completed: bool = Field(default=False)
