from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class ApplicationStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class CreatorApplication(SQLModel, table=True):
    __tablename__ = 'creator_applications'
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    reason: str
    experience: str
    expertise: str
    status: ApplicationStatus = Field(default=ApplicationStatus.APPROVED)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
