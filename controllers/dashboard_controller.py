from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from database import engine
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import course_service
from services import course_service
from controllers.course_controller import get_current_user
from models.user_model import User
from services import dashboard_service
from schemas.dashboard_schema import AddToCartRequest

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session
        

SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/all-courses")
def get_all_courses(db: SessionDep):
    return course_service.fetch_all_courses(db)


@router.get("/user-courses")
def get_user_coursesdb(db : SessionDep, current_user : User = Depends(get_current_user)) :
    return dashboard_service.user_courses(db, current_user)


@router.get("/popular-courses") 
def popular_courses(db : SessionDep) :
    return dashboard_service.get_top_courses(db)


@router.post("/add-to-cart") 
def add_course_to_cart(db : SessionDep, request: AddToCartRequest, current_user : User = Depends(get_current_user)):
    return dashboard_service.add_course_to_cart(db, request.course_id, current_user.id)


@router.get("/cart-count")
def cart_count(db : SessionDep, user : User = Depends(get_current_user)):
    return dashboard_service.get_cart_count(db, user.id)


@router.get("/cart") 
def get_cart_courses(db : SessionDep, current_user : User = Depends(get_current_user)):
    return dashboard_service.get_cart_courses(db, current_user.id)

@router.post("/purchase/{course_id}")
def purchase_course(course_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    return dashboard_service.purchase_course(course_id, current_user.id, db)

@router.get("/courses/category-counts")
def courses_by_category(db: SessionDep):
    return dashboard_service.get_category_counts(db)


@router.get("/courses/stats")
def get_course_stats(db: SessionDep):
    return dashboard_service.get_course_stats_service(db)
    

@router.get("/stats")
def get_user_statistics(db: SessionDep, current_user: User = Depends(get_current_user)):
    return dashboard_service.get_user_statistics(db, current_user.id)


@router.get("/last-enrollments")
def get_last_two_enrollments(db: SessionDep, current_user: User = Depends(get_current_user)):
    return dashboard_service.get_last_two_enrollments(db, current_user.id)


@router.delete("/cart-delete/{cart_id}")
def remove_from_cart(cart_id: int, db: SessionDep, current_user: User = Depends(get_current_user)):
    return dashboard_service.remove_cart_item(db, cart_id, current_user.id)