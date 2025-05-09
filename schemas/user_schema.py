from pydantic import BaseModel, EmailStr
from enum import Enum

class Role(str, Enum):
    USER = "USER"
    CREATOR = "CREATOR"
    ADMIN = "ADMIN"

class UserCreate(BaseModel):
    name: str
    surname: str
    username: str
    email: EmailStr
    password: str
    role: Role = Role.USER
