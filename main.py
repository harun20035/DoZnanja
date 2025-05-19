from fastapi import FastAPI
from database import database
from init_db import create_db_and_tables
from controllers import user_controller, course_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Serve images folder
app.mount("/images", StaticFiles(directory="images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
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


app.mount("/images", StaticFiles(directory="images"), name="images")


app.include_router(user_controller.router, prefix="/users", tags=["Users"])
app.include_router(course_controller.router, prefix="/course", tags=["Course"])
app.include_router(course_controller.router, prefix="/api", tags=["Courses"])
