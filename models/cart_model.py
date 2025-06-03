from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Cart(SQLModel, table = True) :
    __tablename__ = 'cart'

    id: Optional[int] = Field(default=None, primary_key= True)
    user_id: int = Field(foreign_key="users.id")
    course_id : int = Field(foreign_key="courses.id")
    added_at : datetime = Field(default_factory=datetime.utcnow)