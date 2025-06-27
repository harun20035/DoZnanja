from fastapi import FastAPI
from database import database
from init_db import create_db_and_tables
from controllers import user_controller, course_controller, dashboard_controller, tokens_controller, creator_controller,chat_controller
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from controllers import quiz_controller
from controllers import course_progress_controller,admin_controller

from fastapi.staticfiles import StaticFiles

app = FastAPI()


# Serve images folder
app.mount("/images", StaticFiles(directory="images"), name="images")
app.mount("/videos", StaticFiles(directory="videos"), name="videos")

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




app.include_router(user_controller.router, prefix="/users", tags=["Users"])
app.include_router(course_controller.router, prefix="/course", tags=["Course"])
app.include_router(dashboard_controller.router, prefix="/user", tags=["User"])
app.include_router(user_controller.router, prefix="/api", tags=["User"])
app.include_router(tokens_controller.router)
app.include_router(creator_controller.router, tags=["Creator"])
app.include_router(chat_controller.router,prefix ="/chat",tags=["Chat"])
app.include_router(quiz_controller.router)
app.include_router(course_progress_controller.router)
app.include_router(admin_controller.router,prefix="/admin",tags=["Admin"])