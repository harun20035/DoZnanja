from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    course_id: int

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    rating: float
    comment: Optional[str]
    created_at: datetime
    username: Optional[str] = None  # Za prikaz korisničkog imena

    class Config:
        orm_mode = True 