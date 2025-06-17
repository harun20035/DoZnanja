from sqlmodel import Session
from models.creator_application_model import CreatorApplication, ApplicationStatus
from models.user_model import User, Role
from schemas.creator_schema import CreatorApplicationCreate
from repositories import creator_repository
from fastapi import HTTPException

CREATOR_APPLICATION_COST = 100

def create_creator_application(user: User, application_data: CreatorApplicationCreate, session: Session) -> dict:
    # Provjeri da li korisnik već ima prijavu
    existing_application = creator_repository.get_application_by_user_id(session, user.id)
    if existing_application:
        raise HTTPException(
            status_code=400, 
            detail="Već ste kreator ili ste već poslali prijavu."
        )
    
    # Provjeri da li je korisnik već kreator
    if user.role == Role.CREATOR:
        raise HTTPException(
            status_code=400,
            detail="Već ste kreator sadržaja."
        )
    
    # Provjeri da li korisnik ima dovoljno kredita
    if user.credits < CREATOR_APPLICATION_COST:
        raise HTTPException(
            status_code=400,
            detail=f"Nemate dovoljno kredita. Potrebno je {CREATOR_APPLICATION_COST} kredita, a imate {user.credits}."
        )
    
    # Oduzmi kredite
    updated_user = creator_repository.deduct_user_credits(session, user.id, CREATOR_APPLICATION_COST)
    if not updated_user:
        raise HTTPException(status_code=400, detail="Greška pri oduzimanju kredita")
    
    # Kreiraj prijavu
    application = CreatorApplication(
        user_id=user.id,
        reason=application_data.reason,
        experience=application_data.experience,
        expertise=application_data.expertise,
        status=ApplicationStatus.APPROVED  # Odmah odobreno
    )
    
    # Sačuvaj prijavu
    saved_application = creator_repository.create_creator_application(session, application)
    
    # Promijeni ulogu korisnika u CREATOR
    creator_user = creator_repository.change_user_role(session, user.id, Role.CREATOR)
    
    if not creator_user:
        raise HTTPException(status_code=500, detail="Greška pri promjeni uloge")
    
    return {
        "message": "Čestitamo! Uspješno ste postali kreator sadržaja!",
        "application_id": saved_application.id,
        "new_role": creator_user.role.value,
        "remaining_credits": creator_user.credits
    }

def get_user_application_status(user_id: int, session: Session):
    application = creator_repository.get_application_by_user_id(session, user_id)
    if not application:
        return {"has_application": False}
    
    return {
        "has_application": True,
        "status": application.status.value,
        "created_at": application.created_at.isoformat(),
        "reason": application.reason,
        "experience": application.experience,
        "expertise": application.expertise
    }
