# schemas/chat_schema.py
from pydantic import BaseModel
from typing import Optional

class ChatPartnerResponse(BaseModel):
    id: int
    name: str
    surname: str
    profile_image: Optional[str]
    course_title: str
