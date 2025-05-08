from sqlmodel import SQLModel
from database import engine
from models.user_model import User  
from models.course_model import Course

def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)
