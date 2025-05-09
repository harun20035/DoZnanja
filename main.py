from fastapi import FastAPI
from database import database
from init_db import create_db_and_tables
from controllers import user_controller
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Dopušta samo ovom URL-u
    allow_credentials=True,
    allow_methods=["*"],  # Dopušta sve HTTP metode (GET, POST, PUT, DELETE, itd.)
    allow_headers=["*"],  # Dopušta sve zaglavlja
)



@app.on_event("startup")
async def startup():
    create_db_and_tables()
    await database.connect()
    print("✅ Povezani na bazu.")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    print("❌ Prekinuta konekcija.")

@app.get("/")
async def test_connection():
    result = await database.fetch_one("SELECT NOW();")
    return {"vreme_na_bazi": result[0]}


app.include_router(user_controller.router, prefix="/users", tags=["Users"])
