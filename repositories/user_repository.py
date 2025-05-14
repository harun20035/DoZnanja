from sqlmodel import Session, select
from models.user_model import User

def create_user(session: Session, user: User) ->  User:
  session.add(user)
  session.commit()
  session.refresh(user)

  return user