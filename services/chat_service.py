from sqlalchemy.orm import Session
from models.user_model import User 
from repositories.chat_repository import (
    get_chat_partners_for_user,
    get_chat_partners_for_creator_students,
    get_chat_partners_for_creator_purchased,
    save_message,
    get_messages_between_users
)
from repositories import chat_repository

def get_available_chat_partners(db: Session, current_user: User):
    if current_user.role == "USER":
        raw_results = get_chat_partners_for_user(db, current_user.id)
    elif current_user.role == "CREATOR":
        students = get_chat_partners_for_creator_students(db, current_user.id)
        other_creators = get_chat_partners_for_creator_purchased(db, current_user.id)
        raw_results = students + other_creators
    else:
        return []

    # Pretvori tuple u dict (ručno mapiraj)
    results = []
    for row in raw_results:
        
        user_data = {
            "id": row[0],
            "name": row[1],
            "surname": row[2],
            "profile_image": row[3],
            "course_title": row[4],
            "course_id": row[5]
        }
        results.append(user_data)
        

    # Eliminacija duplikata po "id + course_title"
    unique_map = {f"{r['id']}-{r['course_id']}": r for r in results}
    

    return list(unique_map.values())

def save_message(db: Session, sender_id: int, receiver_id: int, course_id: int, content: str):
    chat_repository.save_message(db, sender_id, receiver_id, course_id, content)

def get_chat_messages(db: Session, user1_id: int, user2_id: int, course_id: int):
    print(">>> CHAT GET POZIV")
    print("Sender ID:", user1_id)
    print("Receiver ID:", user2_id)
    print("Course ID:", course_id)
    return chat_repository.get_messages_between_users(db, user1_id, user2_id, course_id)
