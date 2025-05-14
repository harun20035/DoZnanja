from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Annotated
from database import engine
from schemas.course_schema import CourseCreate
from services.course_service import create_course
from fastapi.security import OAuth2PasswordBearer
import jwt
import os
from models.user_model import User

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
print(SECRET_KEY)
ALGORITHM = "HS256"

def get_session():
    with Session(engine) as session:
        yield session
        

SessionDep = Annotated[Session, Depends(get_session)]

def get_current_user(db: SessionDep, token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/create")
def create_course_controller(
    db: SessionDep,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    discount_percent: int = Form(...),
    image_thumbnail: UploadFile = File(...),
    video_demo: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    print("dadad" + current_user.id)
    try:
        course = create_course(
            db=db,
            creator_id=current_user.id,
            course_data={
                "title": title,
                "description": description,
                "price": price,
                "discount_percent": discount_percent,
            },
            image_thumbnail=image_thumbnail,
            video_demo=video_demo
        )
        return {"message": "Course created", "course_id": course.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))