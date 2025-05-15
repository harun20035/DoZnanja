from sqlmodel import Session, select
from models.user_model import User, Role

def create_user(session: Session, user: User) ->  User:
  session.add(user)
  session.commit()
  session.refresh(user)

  return user

def get_user_by_email(session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()

def create_user_with_google(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user