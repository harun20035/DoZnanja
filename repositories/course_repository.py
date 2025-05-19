from sqlalchemy.orm import Session
from models.course_model import Course
from models.user_model import User
from fastapi import HTTPException
from schemas.course_schema import UserUpdate

def create_course(db: Session, course: Course) -> Course:
    db.add(course)
    db.commit()
    db.refresh(course)
    return course



def r_update_user(db: Session, user_data: UserUpdate, current_user: User):
    user_db = db.query(User).filter(User.id == current_user.id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")

    # Username: ako se promenio, proveri da li je zauzet
    if user_data.username is not None:
        if user_data.username != user_db.username:
            existing_user = db.query(User).filter(User.username == user_data.username).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Korisničko ime je već zauzeto")
        user_db.username = user_data.username  # postavi i ako je isto

    # Email: isto kao za username
    if user_data.email is not None:
        if user_data.email != user_db.email:
            existing_user = db.query(User).filter(User.email == user_data.email).first()
            if existing_user and existing_user.id != current_user.id:
                raise HTTPException(status_code=400, detail="Email adresa je već zauzeta")
        user_db.email = user_data.email  # postavi i ako je isto

    # Ostala polja
    if user_data.name is not None:
        user_db.name = user_data.name
    if user_data.surname is not None:
        user_db.surname = user_data.surname

    db.commit()
    db.refresh(user_db)
    return user_db





