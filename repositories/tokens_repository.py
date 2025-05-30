from sqlmodel import Session, select
from models.user_model import User

def get_user_by_id(session: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).first()

def update_user_credits(session: Session, user_id: int, credits_to_add: int) -> User | None:
    user = get_user_by_id(session, user_id)
    if not user:
        return None
    user.credits += credits_to_add
    if user.credits < 0:
        user.credits = 0  # opcionalno, ne dozvoliti negativne kredite
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
