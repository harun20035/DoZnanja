from sqlmodel import SQLModel, Field
from typing import Optional

class CourseStep(SQLModel, table=True):
    __tablename__ = "course_steps"

    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="courses.id")
    title: str
    description: str
    video_url: Optional[str] = Field(default=None, nullable=True)
    image_url: Optional[str] = Field(default=None, nullable=True)
