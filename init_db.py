from sqlmodel import SQLModel
from database import engine
from models.user_model import User  
from models.course_model import Course
from models.courseStep_model import CourseStep

def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)
