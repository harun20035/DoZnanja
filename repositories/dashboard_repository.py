from sqlalchemy.orm import Session
from models.course_model import Course
from sqlmodel import Session, select
from typing import List
from sqlalchemy import select, func
from models.courseEnrollment_model import CourseEnrollment
from models.user_model import User
from fastapi import HTTPException
from models.courseStep_model import CourseStep
from models.cart_model import Cart
from sqlalchemy.exc import IntegrityError







def get_all_courses(db: Session) -> List[Course]:
    statement = select(Course)
    results = db.execute(statement).scalars()
    return results.all()


def get_user_courses_from_db(db: Session, user_id: int):
    try:
        # Povezivanje sa svim tablicama
        courses = db.query(Course, User.username.label("creator_name")).\
            join(User, Course.creator_id == User.id).\
            join(CourseEnrollment, CourseEnrollment.course_id == Course.id).\
            filter(CourseEnrollment.user_id == user_id).all()

        # Mapiranje rezultata, sada ispravno pristupamo tuple-u
        return [{
            "id": course[0].id,  # Pristupamo Course objektu
            "title": course[0].title,
            "creator_name": course.creator_name,  # Ime kreatora iz User modela
            "category": course[0].category,
            "description": course[0].description,
            "image_thumbnail": course[0].image_thumbnail,
            "average_rating": course[0].average_rating,
        } for course in courses]

    except Exception as e:
        print(f"Greška pri dohvaćanju kurseva: {str(e)}")  # Ispis greške
        raise HTTPException(status_code=500, detail=f"Error retrieving courses: {str(e)}")



def get_top_courses_from_db(db: Session):
    try:
        # Upit za dobijanje top kurseva sa brojem koraka, brojem studenata i slikom
        top_courses = db.query(
            Course.id,
            Course.title,
            User.username.label("creator_name"),  # Ime kreatora kursa
            Course.price,
            Course.discount_percent,
            Course.category,
            Course.average_rating,
            Course.image_thumbnail,  # Dodano polje za sliku
            # Broj koraka za kurs (ako nema, biće 0)
            func.coalesce(func.count(CourseStep.id), 0).label("steps"),
            # Broj studenata za kurs (ako nema, biće 0)
            func.coalesce(func.count(CourseEnrollment.id), 0).label("students")
        ).join(User, Course.creator_id == User.id) \
         .join(CourseStep, Course.id == CourseStep.course_id, isouter=True) \
         .join(CourseEnrollment, Course.id == CourseEnrollment.course_id, isouter=True) \
         .group_by(
             Course.id,
             Course.title,
             User.username,
             Course.price,
             Course.discount_percent,
             Course.category,
             Course.average_rating,
             Course.image_thumbnail  # Dodajemo polje slike u group_by
         ) \
         .order_by(Course.average_rating.desc()) \
         .limit(4).all()

        print(f"Top courses: {top_courses}")  # Provjera za debugiranje

        return [{
            "id": course.id,
            "title": course.title,
            "creator_name": course.creator_name,
            "price": course.price,
            "discount_percent": course.discount_percent,
            "category": course.category,
            "average_rating": course.average_rating,
            "steps": course.steps,
            "students": course.students,
            "sale_price": course.price - (course.price * (course.discount_percent / 100)),  # Popust
            "image": course.image_thumbnail  # Dodano sliku za frontend
        } for course in top_courses]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving top courses: {str(e)}")




def add_course_to_cart(db : Session, course_id : int, user_id : int ) :
    existing_cart_item = db.query(Cart).filter(Cart.user_id == user_id, Cart.course_id == course_id).first()

    if existing_cart_item:
        raise HTTPException(status_code=400, detail="Kurs je već dodan u korpu.")
    
    new_cart_item = Cart(user_id = user_id, course_id= course_id)

    try:
        db.add(new_cart_item)
        db.commit()
        db.refresh(new_cart_item)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Problem u dodavanju u korpu")
    
    return new_cart_item




