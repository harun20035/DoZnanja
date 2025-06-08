from sqlalchemy.orm import Session
from models.course_model import Course
from sqlmodel import Session, select, delete
from typing import List
from sqlalchemy import select, func, distinct
from models.courseEnrollment_model import CourseEnrollment
from models.user_model import User
from fastapi import HTTPException
from models.courseStep_model import CourseStep
from models.cart_model import Cart
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError








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



def count_cart_items(db : Session, user_id: int) -> int:
    return db.query(Cart).filter(Cart.user_id == user_id).count()

def get_user_cart_courses(db: Session, user_id: int):
    statement = (
        select(
            Course.id,
            Course.title,
            Course.image_thumbnail,
            Course.description,
            Course.price,
            Course.video_demo,
            User.name,
            User.surname
        )
        .join(Cart, Cart.course_id == Course.id)
        .join(User, User.id == Course.creator_id)
        .where(Cart.user_id == user_id)
    )
    results = db.execute(statement).mappings().all()
    return [dict(row) for row in results]


def purchase_course(course_id: int, user_id: int, db: Session):
    try:
        # 1. Provjeri da li je kurs u korpi
        cart_item = db.execute(
            select(Cart).where(Cart.user_id == user_id, Cart.course_id == course_id)
        ).scalars().first()

        if not cart_item:
            raise HTTPException(status_code=400, detail="Kurs nije u korpi.")

        # 2. Dohvati kurs
        course = db.execute(select(Course).where(Course.id == course_id)).scalars().first()
        if not course:
            raise HTTPException(status_code=404, detail="Kurs ne postoji.")

        # 3. Dohvati korisnika
        user = db.execute(select(User).where(User.id == user_id)).scalars().first()
        if user.credits < course.price:
            deficit = int(course.price - user.credits)
            raise HTTPException(status_code=400, detail=f"Nedovoljno kredita. Nedostaje {deficit} kredita.")


        # 4. Skini korisniku kredite
        user.credits -= int(course.price)

        # 5. Dodaj kreatoru 80%
        creator = db.execute(select(User).where(User.id == course.creator_id)).scalars().first()
        creator.credits += int(course.price * 0.8)

        # 6. Ubaci u enrollments
        enrollment = CourseEnrollment(
            user_id=user_id,
            course_id=course_id,
            enrolled_at=datetime.utcnow()
        )
        db.add(enrollment)

        # 7. Obriši iz korpe
        db.execute(
            delete(Cart).where(Cart.user_id == user_id, Cart.course_id == course_id)
        )

        db.commit()
        return {"message": "Kupovina uspješna."}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Greška u bazi: {str(e)}")

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Neočekivana greška: {str(e)}")


def get_courses_count_by_category(db: Session):
    # Upit koji grupiše kurseve po kategoriji i broji ih
    result = db.query(
        Course.category,
        func.count(Course.id).label("course_count")
    ).group_by(Course.category).all()

    # Pretvaranje rezultata u dictionary format za serijalizaciju u JSON
    return [{"category": category, "course_count": course_count} for category, course_count in result]

def get_course_stats(db: Session):
    result = db.query(
        func.count(Course.id).label("total_courses"),
        # Koristi subquery da brojimo jedinstvene kreatore
        func.count(distinct(Course.creator_id)).label("total_creators"), 
        func.count(CourseEnrollment.id).label("total_enrolled_users")
    ).join(User, Course.creator_id == User.id) \
     .join(CourseEnrollment, Course.id == CourseEnrollment.course_id, isouter=True) \
     .first()

    # Pretvaranje rezultata u dictionary
    if result:
        return {
            "total_courses": result[0],
            "total_creators": result[1],
            "total_enrolled_users": result[2]
        }
    return {}
