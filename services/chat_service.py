from sqlalchemy.orm import Session
from models.user_model import User 
from repositories.chat_repository import (
    get_chat_partners_for_user,
    get_chat_partners_for_creator_students,
    get_chat_partners_for_creator_purchased,
)

def get_available_chat_partners(db: Session, current_user: User):
    if current_user.role == "USER":
        results = get_chat_partners_for_user(db, current_user.id)
    elif current_user.role == "CREATOR":
        students = get_chat_partners_for_creator_students(db, current_user.id)
        other_creators = get_chat_partners_for_creator_purchased(db, current_user.id)
        combined = {f"{u.id}-{u.course_title}": u for u in students + other_creators}
        results = list(combined.values())
    else:
        return []

    # Pretvaranje Row objekata u dictove da FastAPI može serializirati
    return [
        {
            "id": row.id,
            "name": row.name,
            "surname": row.surname,
            "profile_image": row.profile_image,
            "course_title": row.course_title,
        }
        for row in results
    ]