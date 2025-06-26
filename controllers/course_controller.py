from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Annotated, Optional, List
from database import engine
from schemas.course_schema import CourseCreate, Category, UserUpdate, ChangePassword, ChangePhoto, StepDate, CourseSchema, CourseWithDetailsResponse
from services.course_service import create_course, update_user_data, change_password_data, change_photo_data,get_creator_courses_list,create_step_course_service,get_step_course_service,delete_step_course_service
from services.course_service import update_step_course_service, get_course_with_details
from fastapi.security import OAuth2PasswordBearer
import jwt
import os
from models.user_model import User
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import course_service
from models.course_model import Course
from fastapi import APIRouter, Depends
from services import course_service
from typing import Optional
from services.course_service import get_course
from services import review_service
from schemas.review_schema import ReviewCreate
from schemas.review_schema import ReviewResponse
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
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

# Opcionalni current user za javne endpoint-e
def get_current_user_optional(db: SessionDep, token: Optional[str] = Depends(oauth2_scheme)) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            return None

        user = db.query(User).filter(User.id == user_id).first()
        return user
    except jwt.PyJWTError:
        return None

@router.post("/create")
def create_course_controller(db: SessionDep,title: str = Form(...),description: str = Form(...),price: float = Form(...),discount_percent: int = Form(...),category: Category = Form(...),image_thumbnail: UploadFile = File(...),video_demo: UploadFile = File(...),current_user: User = Depends(get_current_user)):
    try:
        course = create_course(db=db, creator_id=current_user.id,course_data=CourseCreate(title=title,description=description,price=price,discount_percent=discount_percent,category=category),
            image_thumbnail=image_thumbnail,
            video_demo=video_demo
        )
        return {"message": "Course created", "course_id": course.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/statistika")
def get_creator_statistics(db: SessionDep, current_user: User = Depends(get_current_user)):
    return course_service.get_creator_stats(db, current_user.id)

@router.get("/view/{course_id}", response_model=CourseWithDetailsResponse)
def get_course_details(
    course_id: int, 
    db: SessionDep, 
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Dohvata kurs sa svim detaljima uključujući kreatora i step-ove.
    Dostupno svim korisnicima, ali enrolled status se provjerava samo za ulogovane.
    """
    user_id = current_user.id if current_user else None
    return get_course_with_details(db, course_id, user_id)

@router.get("/me")
def get_user(db:SessionDep,current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/update")
def update_user(user_data : UserUpdate, db : SessionDep, current_user : User = Depends(get_current_user)):
    return update_user_data(user_data, db, current_user)

@router.put("/change-password")
def change_password(user_data : ChangePassword, db : SessionDep, current_user : User = Depends(get_current_user)):
    return change_password_data(user_data, db, current_user)

@router.put("/change-photo")
def change_photo(db: SessionDep, profile_image: UploadFile = File(...) , current_user: User = Depends(get_current_user)):
    return change_photo_data(db, profile_image, current_user)

@router.get("/creator-courses")
def get_creator_courses(db : SessionDep, current_user : User = Depends(get_current_user)):
    return get_creator_courses_list(db, current_user)

@router.post("/{course_id}")
def create_step_course(db: SessionDep, course_id: int, title: str = Form(...), description: str = Form(...), video_url: Optional[ UploadFile]= File(None),image_url: Optional[ UploadFile] = File(None)) :
    step_data = StepDate(title=title, description=description)
    return create_step_course_service(db, course_id, step_data, video_url, image_url)

@router.get("/{course_id}")
def get_step_course(db:SessionDep,course_id:int):
    return get_step_course_service(db,course_id)

@router.delete("/{step_id}")
def delete_step_course(db:SessionDep,step_id:int):
    return delete_step_course_service(db,step_id)

@router.put("/{step_id}")
def update_step_course(db : SessionDep, step_id : int, title: str = Form(...), description: str = Form(...), video_url: Optional[ UploadFile]= File(None),image_url: Optional[ UploadFile] = File(None)):
    step_data = StepDate(title=title, description=description)
    return update_step_course_service(db, step_id, step_data, video_url, image_url)

@router.get("/{id}", response_model=CourseSchema)
def get_course_endpoint(course_id: int, session: Session = Depends(get_session)):
    return get_course(session, course_id)

@router.get("/creator-courses/stats")
def get_creator_courses(db : SessionDep, current_user: User = Depends(get_current_user)):
    return course_service.get_creator_courses_with_stats(db, current_user)

@router.post("/reviews/", response_model=ReviewResponse)
def add_review(
    review: ReviewCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    try:
        return review_service.add_review_service(db, review, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class CommentCreate(BaseModel):
    course_id: int
    comment: str

@router.post("/comments/", response_model=ReviewResponse)
def add_comment(
    comment_data: CommentCreate,
    db: SessionDep,
    current_user: User = Depends(get_current_user)
):
    try:
        return review_service.add_comment_service(db, comment_data.course_id, comment_data.comment, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reviews/by-course/{course_id}", response_model=List[ReviewResponse])
def get_reviews_by_course(
    course_id: int,
    db: SessionDep,
    skip: int = 0,
    limit: int = 5
):
    return review_service.get_reviews_by_course_service(db, course_id, skip=skip, limit=limit)


