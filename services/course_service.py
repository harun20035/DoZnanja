from fastapi import UploadFile
from sqlalchemy.orm import Session
from models.course_model import Course
from schemas.course_schema import CourseCreate, UserUpdate
from repositories import course_repository
from datetime import datetime
from models.user_model import User
import shutil
import jwt
import os
import uuid

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

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


def update_user_data(user_data: UserUpdate, db: Session, current_user: User):
    return course_repository.r_update_user(db, user_data, current_user)







