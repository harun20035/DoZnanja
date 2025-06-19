from sqlalchemy.orm import Session
from models.user_model import User 
from repositories.chat_repository import (
    get_chat_partners_for_user,
    get_chat_partners_for_creator_students,
    get_chat_partners_for_creator_purchased,
    save_message,
    get_messages_between_users
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
    
    for row in results:
        print("ROW DEBUG:", row)


    # Pretvaranje Row objekata u dictove da FastAPI može serializirati
    return [
        {
            "id": row.id,
            "name": row.name,
            "surname": row.surname,
            "profile_image": row.profile_image,
            "course_title": row.course_title,
            "course_id": row.course_id
        }
        for row in results
    ]

# Spremanje poruke
def save_message(db: Session, sender_id: int, receiver_id: int, course_id: int, content: str):
    save_message(db, sender_id, receiver_id, course_id, content)

# Dohvat svih poruka između dva usera za određeni kurs
def get_chat_messages(db: Session, user1_id: int, user2_id: int, course_id: int):
    return get_messages_between_users(db, user1_id, user2_id, course_id)