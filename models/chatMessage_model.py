from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ChatMessage(SQLModel, table=True):
    
    __tablename__ = "chat_messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="users.id")
    receiver_id: int = Field(foreign_key="users.id")
    course_id: int = Field(foreign_key="courses.id")
    content: str
    timestamp: datetime
