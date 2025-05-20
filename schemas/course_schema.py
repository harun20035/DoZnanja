from pydantic import BaseModel
from typing import Optional
from enum import Enum
from fastapi import UploadFile

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