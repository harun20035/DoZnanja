from pydantic import BaseModel

class CreatorApplicationCreate(BaseModel):
    reason: str
    experience: str
    expertise: str

class CreatorApplicationResponse(BaseModel):
    id: int
    user_id: int
    reason: str
    experience: str
    expertise: str
    status: str
    created_at: str
    
    class Config:
        from_attributes = True
