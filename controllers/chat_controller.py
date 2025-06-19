from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from typing import List, Dict
from sqlalchemy.orm import Session
from models.user_model import User
from services import chat_service
from database import engine
from fastapi.security import OAuth2PasswordBearer
from schemas.chat_schema import ChatPartnerResponse, ChatMessageResponse
import os, jwt

router = APIRouter()

# ✅ Session generator
def get_sync_session():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

# ✅ Auth setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(db: Session = Depends(get_sync_session), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Dohvati chat partnere
@router.get("/partners", response_model=List[ChatPartnerResponse])
def get_chat_partners(
    db: Session = Depends(get_sync_session),
    current_user: User = Depends(get_current_user)
):
    return chat_service.get_available_chat_partners(db, current_user)

# ✅ WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, receiver_id: int, message: str):
        ws = self.active_connections.get(receiver_id)
        if ws:
            await ws.send_text(message)

manager = ConnectionManager()

# ✅ WebSocket endpoint
@router.websocket("/ws/chat/{receiver_id}/{course_id}")
async def websocket_chat(websocket: WebSocket, receiver_id: int, course_id: int):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    db_gen = get_sync_session()
    db = next(db_gen)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            await websocket.close(code=1008)
            return

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user:
            await websocket.close(code=1008)
            return

        sender_id = user.id
        await manager.connect(sender_id, websocket)

        try:
            while True:
                msg = await websocket.receive_text()
                chat_service.save_message(db, sender_id, receiver_id, course_id, msg)
                await manager.send_personal_message(receiver_id, msg)
        except WebSocketDisconnect:
            manager.disconnect(sender_id)

    except Exception as e:
        print("❌ WebSocket greška:", e)
        await websocket.close(code=1011)
    finally:
        db_gen.close()

# ✅ Dohvati poruke
@router.get("/messages/{user_id}/{course_id}", response_model=List[ChatMessageResponse])
def get_chat_messages(
    user_id: int,
    course_id: int,
    db: Session = Depends(get_sync_session),
    current_user: User = Depends(get_current_user)
):
    return chat_service.get_chat_messages(db, current_user.id, user_id, course_id)
