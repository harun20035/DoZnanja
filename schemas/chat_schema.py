# schemas/chat_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatPartnerResponse(BaseModel):
    id: int
    name: str
    surname: str
    profile_image: Optional[str]
    course_title: str
    course_id : int


class ChatMessageResponse(BaseModel):
    sender_id: int
    receiver_id: int
    course_id: int
    content: str
    timestamp: datetime

    class Config:
        orm_mode = True