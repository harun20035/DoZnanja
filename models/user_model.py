from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum

class Role(str, Enum):
    USER = "USER"
    CREATOR = "CREATOR"
    ADMIN = "ADMIN"

class User(SQLModel, table=True):
    
    __tablename__ = 'users'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    surname: str
    username:str = Field(sa_column_kwargs={"unique": True})
    email: str = Field(sa_column_kwargs={"unique": True})
    password_hash: str
    role: Role  # 'student', 'creator', 'admin'
    credits: int = 0
    google_id: Optional[str] = None
    profile_image: Optional[str] = None
