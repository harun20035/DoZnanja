from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Annotated
from pydantic import BaseModel

from services.tokens_service import add_credits, get_credits
from database import engine  # pretpostavka da već imaš engine

router = APIRouter(prefix="/tokens", tags=["tokens"])

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

class CreditsPurchaseRequest(BaseModel):
    user_id: int
    amount: int

@router.post("/purchase")
def purchase_credits(data: CreditsPurchaseRequest, db: SessionDep):
    user = add_credits(db, data.user_id, data.amount)
    if not user:
        raise HTTPException(status_code=400, detail="Nevalidan iznos ili korisnik nije pronađen")
    return {
        "message": "Krediti uspješno dodani",
        "user_id": user.id,
        "new_balance": user.credits
    }

@router.get("/{user_id}")
def get_user_credits(user_id: int, db: SessionDep):
    credits = get_credits(db, user_id)
    if credits is None:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")
    return {
        "user_id": user_id,
        "credits": credits
    }
