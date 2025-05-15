from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class Status(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class Category(str, Enum):
    PROGRAMMING = "Programming"
    DESIGN = "Design"
    MARKETING = "Marketing"
    MUSIC = "Music"
    BUSINESS = "Business"
    PHOTOGRAPHY = "Photography"
    LANGUAGES = "Languages"
    OTHER = "Other"

class Course(SQLModel, table=True):

    __tablename__ = 'courses'

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="users.id")
    title: str
    description: str
    price: float
    discount_percent: int
    status: Status  # 'pending', 'approved', 'rejected'
    category: Category 
    created_at: datetime
    image_thumbnail: Optional[str] = None
    video_demo: Optional[str] = None
    average_rating: float = 0