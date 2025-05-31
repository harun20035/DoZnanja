from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Review(SQLModel, table=True):
    __tablename__ = 'reviews'
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")  # Ko je ostavio recenziju
    course_id: int = Field(foreign_key="courses.id")  # Na koji kurs je recenzija
    rating: float = Field(..., ge=1, le=5)  # Ocjena od 1 do 5
    comment: Optional[str] = Field(default=None)  # Komentar korisnika
    created_at: datetime = Field(default_factory=datetime.utcnow)  # Datum kada je ostavljena recenzija

