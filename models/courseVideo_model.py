from sqlmodel import SQLModel, Field
from typing import Optional

class CourseVideo(SQLModel, table=True):

    __tablename__ = 'course_videos'

    id: Optional[int] = Field(default=None, primary_key=True)
    course_id: int = Field(foreign_key="course.id")
    video_url: str
    title: str
    order_number: int
