from sqlmodel import SQLModel
from database import engine
from models.user_model import User  
from models.course_model import Course
from models.courseStep_model import CourseStep
from models.courseEnrollment_model import CourseEnrollment
from models.reviewCourses_model import Review
from models.cart_model import Cart
from models.chatMessage_model import ChatMessage


def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)
