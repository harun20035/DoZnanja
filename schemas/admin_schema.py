from pydantic import BaseModel
from enum import Enum

class CourseStatus(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"



class CourseStatusUpdate(BaseModel):
    new_status: str
