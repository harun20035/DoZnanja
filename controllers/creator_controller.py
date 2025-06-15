from sqlmodel import Session
from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException
from controllers.course_controller import get_current_user
from schemas.creator_schema import CreatorApplicationCreate
from services.creator_service import (
    create_creator_application, 
    get_user_application_status
)
from database import engine
from models.user_model import User

router = APIRouter()

# Session dependency
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@router.post("/become-creator")
def apply_for_creator(
    application_data: CreatorApplicationCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Prijava za postanak kreator - odmah postaje kreator"""
    try:
        result = create_creator_application(current_user, application_data, session)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Greška pri slanju prijave: {str(e)}")

@router.get("/my-creator-application")
def get_my_application_status(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Dobij status svoje prijave"""
    return get_user_application_status(current_user.id, session)
