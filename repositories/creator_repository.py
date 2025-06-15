from sqlmodel import Session, select
from models.creator_application_model import CreatorApplication
from models.user_model import User, Role
from typing import Optional

def create_creator_application(session: Session, application: CreatorApplication) -> CreatorApplication:
    session.add(application)
    session.commit()
    session.refresh(application)
    return application

def get_application_by_user_id(session: Session, user_id: int) -> Optional[CreatorApplication]:
    return session.exec(
        select(CreatorApplication).where(CreatorApplication.user_id == user_id)
    ).first()

def change_user_role(session: Session, user_id: int, new_role: Role) -> Optional[User]:
    user = session.get(User, user_id)
    if user:
        user.role = new_role
        session.commit()
        session.refresh(user)
    return user

def deduct_user_credits(session: Session, user_id: int, amount: int) -> Optional[User]:
    user = session.get(User, user_id)
    if user and user.credits >= amount:
        user.credits -= amount
        session.commit()
        session.refresh(user)
        return user
    return None
