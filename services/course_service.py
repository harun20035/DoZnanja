from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.course_model import Course
from schemas.course_schema import CourseCreate, UserUpdate, ChangePassword, ChangePhoto
from repositories import course_repository
from datetime import datetime
from models.user_model import User
import shutil
import jwt
import os
import uuid
from sqlmodel import Session, select
from models.course_model import Course
from sqlmodel import Session
from typing import List
from repositories import course_repository
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def save_file(file: UploadFile, folder: str) -> str:
    ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(folder, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filepath

def create_course(
    db: Session,
    creator_id: int,
    course_data: CourseCreate,
    image_thumbnail: UploadFile,
    video_demo: UploadFile
) -> Course:
    image_path = save_file(image_thumbnail, "images")
    video_path = save_file(video_demo, "videos")

    new_course = Course(
        creator_id=creator_id,
        title=course_data.title,
        description=course_data.description,
        price=course_data.price,
        discount_percent=course_data.discount_percent,
        status=course_data.status,
        category=course_data.category,
        created_at=datetime.utcnow(),
        image_thumbnail=image_path,
        video_demo=video_path,
        average_rating=0.0
    )

    return course_repository.create_course(db, new_course)


def fetch_all_courses(db: Session) -> List[dict]:
    courses = course_repository.get_all_courses(db)
    return [course.dict() for course in courses]

def update_user_data(user_data: UserUpdate, db: Session, current_user: User):
    return course_repository.r_update_user(db, user_data, current_user)


def change_password_data(user_data : ChangePassword, db : Session, current_user : User) :
    user_id = current_user.id
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronadjen")
    if not pwd_context.verify(user_data.current_password, user.password_hash):
        raise HTTPException(status_code=404, detail="Unijeli ste netačnu lozinku")
    
    user.password_hash = pwd_context.hash(user_data.new_password)

    return course_repository.change_password(db, user)


def change_photo_data(db: Session, profile_image: UploadFile,  current_user: User):
    image_path = save_file(profile_image, "images")
    current_user.profile_image = image_path

    return course_repository.change_photo(db, current_user)


def get_creator_courses_list(db : Session, current_user : User) -> List[dict] :
    courses = course_repository.get_creator_courses(db, current_user.id)
    return [course.dict() for course in courses]
