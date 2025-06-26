from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from fastapi import UploadFile
from datetime import datetime

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

class CourseCreate(BaseModel):
    title: str
    description: str
    price: float
    discount_percent: int
    status: Status = Status.PENDING
    category : Category

class UserUpdate(BaseModel):
    name : Optional[str]
    surname : Optional[str]
    username : Optional[str]
    email : Optional[str]

class ChangePassword(BaseModel) :
    current_password : str
    new_password : str

class ChangePhoto(BaseModel) : 
    profile_image : UploadFile

class StepDate(BaseModel) : 
    title : str
    description : str

class CourseSchema(BaseModel):
    id: int
    creator_id: int
    title: str
    description: str
    price: float
    discount_percent: int
    status: Status
    category: Category
    created_at: datetime
    image_thumbnail: Optional[str] = None
    video_demo: Optional[str] = None
    average_rating: float = 0

# NOVE SCHEMA KLASE
class CreatorResponse(BaseModel):
    id: int
    name: str
    surname: str
    username: str

class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    discount_percent: int
    category: str
    image_thumbnail: Optional[str] = None
    video_demo: Optional[str] = None
    average_rating: float
    created_at: datetime
    status: str

class StepResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: str
    video_url: Optional[str] = None
    image_url: Optional[str] = None

class CourseWithDetailsResponse(BaseModel):
    course: CourseResponse
    creator: Optional[CreatorResponse]
    steps: List[StepResponse]
    is_enrolled: bool
    total_steps: int