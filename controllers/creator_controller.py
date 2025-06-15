from fastapi import APIRouter, HTTPException, Depends
from database import database
from controllers.user_controller import get_current_user
from pydantic import BaseModel
from typing import Optional, Union, Dict, Any
from datetime import datetime

router = APIRouter()

# Pydantic modeli
class CreatorApplicationCreate(BaseModel):
    reason: str
    experience: str
    expertise: str

CREATOR_APPLICATION_COST = 100

def extract_user_data(current_user: Union[Dict, Any]) -> Dict[str, Any]:
    """Sigurno izvlačenje podataka iz current_user objekta"""
    try:
        if isinstance(current_user, dict):
            return {
                'id': current_user.get('id'),
                'role': current_user.get('role'),
                'credits': current_user.get('credits', 0)
            }
        else:
            # Ako je objekt s atributima
            return {
                'id': getattr(current_user, 'id', None),
                'role': getattr(current_user, 'role', None),
                'credits': getattr(current_user, 'credits', 0)
            }
    except Exception as e:
        print(f"Error extracting user data: {e}")
        print(f"current_user type: {type(current_user)}")
        print(f"current_user: {current_user}")
        raise HTTPException(status_code=500, detail="Greška pri čitanju korisničkih podataka")

@router.post("/become-creator")
async def apply_for_creator(
    application_data: CreatorApplicationCreate,
    current_user = Depends(get_current_user)  # Uklanjamo type hint
):
    """Prijava za postanak kreator - odmah postaje kreator"""
    try:
        # Sigurno izvlačenje podataka
        user_data = extract_user_data(current_user)
        user_id = user_data['id']
        user_role = user_data['role']
        user_credits = user_data['credits']
        
        if not user_id:
            raise HTTPException(status_code=400, detail="Neispravni korisnički podaci")
        
        # Provjeri da li korisnik već ima prijavu
        existing_application = await database.fetch_one(
            "SELECT * FROM creator_applications WHERE user_id = :user_id",
            {"user_id": user_id}
        )
        
        if existing_application:
            raise HTTPException(
                status_code=400, 
                detail="Već ste kreator ili ste već poslali prijavu."
            )
        
        # Provjeri da li je korisnik već kreator
        if user_role == "CREATOR":
            raise HTTPException(
                status_code=400,
                detail="Već ste kreator sadržaja."
            )
        
        # Provjeri da li korisnik ima dovoljno kredita
        if user_credits < CREATOR_APPLICATION_COST:
            raise HTTPException(
                status_code=400,
                detail=f"Nemate dovoljno kredita. Potrebno je {CREATOR_APPLICATION_COST} kredita, a imate {user_credits}."
            )
        
        # Oduzmi kredite
        await database.execute(
            "UPDATE users SET credits = credits - :cost WHERE id = :user_id",
            {"cost": CREATOR_APPLICATION_COST, "user_id": user_id}
        )
        
        # Kreiraj prijavu
        application_id = await database.execute(
            """
            INSERT INTO creator_applications (user_id, reason, experience, expertise, status, created_at)
            VALUES (:user_id, :reason, :experience, :expertise, 'APPROVED', NOW())
            """,
            {
                "user_id": user_id,
                "reason": application_data.reason,
                "experience": application_data.experience,
                "expertise": application_data.expertise
            }
        )
        
        # Promijeni ulogu korisnika u CREATOR
        await database.execute(
            "UPDATE users SET role = 'CREATOR' WHERE id = :user_id",
            {"user_id": user_id}
        )
        
        # Dobij ažurirane podatke korisnika
        updated_user = await database.fetch_one(
            "SELECT credits, role FROM users WHERE id = :user_id",
            {"user_id": user_id}
        )
        
        return {
            "message": "Čestitamo! Uspješno ste postali kreator sadržaja!",
            "application_id": application_id,
            "new_role": updated_user["role"],
            "remaining_credits": updated_user["credits"]
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(f"current_user type: {type(current_user)}")
        raise HTTPException(status_code=500, detail=f"Greška pri slanju prijave: {str(e)}")

@router.get("/my-creator-application")
async def get_my_application_status(
    current_user = Depends(get_current_user)  # Uklanjamo type hint
):
    """Dobij status svoje prijave"""
    try:
        # Sigurno izvlačenje podataka
        user_data = extract_user_data(current_user)
        user_id = user_data['id']
        
        if not user_id:
            raise HTTPException(status_code=400, detail="Neispravni korisnički podaci")
        
        application = await database.fetch_one(
            "SELECT * FROM creator_applications WHERE user_id = :user_id",
            {"user_id": user_id}
        )
        
        if not application:
            return {"has_application": False}
        
        return {
            "has_application": True,
            "status": application["status"],
            "created_at": application["created_at"].isoformat(),
            "reason": application["reason"],
            "experience": application["experience"],
            "expertise": application["expertise"]
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(f"current_user type: {type(current_user)}")
        raise HTTPException(status_code=500, detail=f"Greška pri dohvaćanju statusa: {str(e)}")
