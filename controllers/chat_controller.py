from fastapi import APIRouter, Depends,HTTPException,WebSocket,WebSocketDisconnect
from typing import List
from sqlalchemy.orm import Session
from models.user_model import User
from services import chat_service
from database import engine
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
import os, jwt
from sqlalchemy.orm import Session
from schemas.chat_schema import ChatPartnerResponse
from typing import List,Dict

router = APIRouter()

# Session i token setup
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_user(db: SessionDep, token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Glavna ruta za dohvat chat partnera
@router.get("/partners", response_model=List[ChatPartnerResponse])
def get_chat_partners(db: SessionDep, current_user: User = Depends(get_current_user)):
    return chat_service.get_available_chat_partners(db, current_user)


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_personal_message(self, receiver_id: int, message: str):
        receiver_socket = self.active_connections.get(receiver_id)
        if receiver_socket:
            await receiver_socket.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/chat/{receiver_id}/{course_id}")
async def websocket_chat(
    websocket: WebSocket,
    receiver_id: int,
    course_id: int,
):
    await websocket.accept()

    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return

    try:
        db = next(get_session())  # direktno uzmi Session generator
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            await websocket.close(code=1008)
            return

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            await websocket.close(code=1008)
            return
    except Exception as e:
        print("Token error:", e)
        await websocket.close(code=1008)
        return

    sender_id = user.id
    await manager.connect(sender_id, websocket)

    try:
        while True:
            content = await websocket.receive_text()
            chat_service.save_message(db, sender_id, receiver_id, course_id, content)
            await manager.send_personal_message(receiver_id, content)
    except WebSocketDisconnect:
        manager.disconnect(sender_id)


# ✅ HTTP ruta za dohvat poruka između dva usera za jedan kurs
@router.get("/messages/{user_id}/{course_id}")
def get_chat_messages(
    user_id: int,
    course_id: int,
    db: SessionDep ,
    current_user: User = Depends(get_current_user),
):
    return chat_service.get(db, current_user.id, user_id, course_id)