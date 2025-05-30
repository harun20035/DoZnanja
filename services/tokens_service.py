from sqlmodel import Session
from repositories.tokens_repository import get_user_by_id, update_user_credits
from models.user_model import User

def add_credits(session: Session, user_id: int, amount: int) -> User | None:
    if amount <= 0:
        return None
    return update_user_credits(session, user_id, amount)

def get_credits(session: Session, user_id: int) -> int | None:
    user = get_user_by_id(session, user_id)
    if not user:
        return None
    return user.credits
