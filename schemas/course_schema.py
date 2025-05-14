from pydantic import BaseModel
from typing import Optional
from enum import Enum

class Status(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class CourseCreate(BaseModel):
    title: str
    description: str
    price: float
    discount_percent: int
    status: Status = Status.PENDING
