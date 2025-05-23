from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from models.course_model import Course
from schemas.course_schema import CourseCreate, UserUpdate, ChangePassword, ChangePhoto, StepDate
from repositories import course_repository
from datetime import datetime
from models.user_model import User
from models.courseStep_model import CourseStep
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
from typing import Optional

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
    user_db = course_repository.get_user_by_id(db, current_user.id)
    if not user_db:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    if user_data.username is not None and user_data.username != user_db.username:
        existing_user = course_repository.get_user_by_username(db, user_data.username)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Korisničko ime je već zauzeto")
        user_db.username = user_data.username

    if user_data.email is not None and user_data.email != user_db.email:
        existing_user = course_repository.get_user_by_email(db, user_data.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email adresa je već zauzeta")
        user_db.email = user_data.email

    if user_data.name is not None:
        user_db.name = user_data.name

    if user_data.surname is not None:
        user_db.surname = user_data.surname

    return course_repository.update_user(db, user_db)


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



def create_step_course_service(
    db: Session, 
    course_id: int, 
    step_data: StepDate, 
    video_file: Optional[UploadFile] = None, 
    image_file: Optional[UploadFile] = None
):
    video_path = save_file(video_file, "videos") if video_file else None
    image_path = save_file(image_file, "images") if image_file else None

    new_step = CourseStep(
        course_id=course_id,
        title=step_data.title,
        description=step_data.description,
        video_url=video_path,
        image_url=image_path
    )

    return course_repository.create_step(db, new_step)

def get_step_course_service(db:Session,course_id:int):
    steps=course_repository.get_step(db,course_id)
    print(steps)
    return [step.dict() for step in steps]

def delete_step_course_service(db:Session,step_id:int):
    step=course_repository.get_step_delete(db,step_id)
    course_repository.delete_step(db,step)

def update_step_course_service(
    db: Session, 
    step_id: int, 
    step_data: StepDate, 
    video_file: Optional[UploadFile] = None, 
    image_file: Optional[UploadFile] = None
):
    step_db = course_repository.get_step_delete(db, step_id)

    step_db.title = step_data.title
    step_db.description = step_data.description

    if video_file:
        step_db.video_url = save_file(video_file, "videos")

    if image_file:
        step_db.image_url = save_file(image_file, "images")

    return course_repository.update_step_course(db, step_db)
