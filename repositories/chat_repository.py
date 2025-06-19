from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user_model import User
from models.course_model import Course
from models.courseEnrollment_model import CourseEnrollment
from datetime import datetime
from models.chatMessage_model import ChatMessage

def get_chat_partners_for_user(db: Session, user_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            Course.title,
            Course.id.label("course_id")  # Dodaj .label() da se jasno označi course_id
        )
        .join(Course, Course.creator_id == User.id)
        .join(CourseEnrollment, CourseEnrollment.course_id == Course.id)
        .filter(CourseEnrollment.user_id == user_id)
        .all()
    )


def get_chat_partners_for_creator_students(db: Session, creator_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            Course.title,
            Course.id
        )
        .join(CourseEnrollment, CourseEnrollment.user_id == User.id)
        .join(Course, Course.id == CourseEnrollment.course_id)
        .filter(Course.creator_id == creator_id)
        .all()
    )

def get_chat_partners_for_creator_purchased(db: Session, creator_id: int):
    return (
        db.query(
            User.id,
            User.name,
            User.surname,
            User.profile_image,
            Course.title,
            Course.id
        )
        .join(Course, Course.creator_id == User.id)
        .join(CourseEnrollment, CourseEnrollment.course_id == Course.id)
        .filter(CourseEnrollment.user_id == creator_id)
        .filter(User.id != creator_id)
        .all()
    )

def save_message(db: Session, sender_id: int, receiver_id: int, course_id: int, content: str):
    message = ChatMessage(
        sender_id=sender_id,
        receiver_id=receiver_id,
        course_id=course_id,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(message)
    db.commit()

def get_messages_between_users(db: Session, user1_id: int, user2_id: int, course_id: int):
    return db.query(ChatMessage).filter(
        ChatMessage.course_id == course_id,
        ((ChatMessage.sender_id == user1_id) & (ChatMessage.receiver_id == user2_id)) |
        ((ChatMessage.sender_id == user2_id) & (ChatMessage.receiver_id == user1_id))
    ).order_by(ChatMessage.timestamp.asc()).all()
