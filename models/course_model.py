from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Course(SQLModel, table=True):
    
    __tablename__ = 'courses'

    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    title: str
    description: str
    price: float
    discount_percent: int
    status: str  # 'pending', 'approved', 'rejected', 'closed'
    created_at: datetime
    average_rating: float = 0
