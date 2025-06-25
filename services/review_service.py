from sqlalchemy.orm import Session
from models.reviewCourses_model import Review
from repositories import review_repository
from schemas.review_schema import ReviewCreate
from models.user_model import User
from models.course_model import Course
from sqlalchemy import func

def add_review_service(db: Session, review_data: ReviewCreate, user_id: int):
    # Proveri da li korisnik već ima ocenu za ovaj kurs
    existing_review = review_repository.get_user_review_for_course(db, user_id, review_data.course_id)
    
    if existing_review:
        # Ako postoji, ažuriraj ocenu
        updated_review = review_repository.update_review_rating(db, existing_review.id, review_data.rating)
        # Ažuriraj prosečnu ocenu kursa
        update_course_average_rating(db, review_data.course_id)
        return updated_review
    else:
        # Ako ne postoji, kreiraj novu
        review = Review(
            user_id=user_id,
            course_id=review_data.course_id,
            rating=review_data.rating,
            comment=review_data.comment
        )
        added_review = review_repository.add_review(db, review)
        # Ažuriraj prosečnu ocenu kursa
        update_course_average_rating(db, review_data.course_id)
        return added_review

def add_comment_service(db: Session, course_id: int, comment: str, user_id: int):
    """Dodaj samo komentar (bez ocene)"""
    review = Review(
        user_id=user_id,
        course_id=course_id,
        rating=0,  # Ocena 0 označava da je samo komentar
        comment=comment
    )
    return review_repository.add_review(db, review)

def update_course_average_rating(db: Session, course_id: int):
    """Izračunaj i ažuriraj prosečnu ocenu kursa na osnovu svih recenzija"""
    # Izračunaj prosečnu ocenu svih recenzija za kurs (samo one sa ocenom > 0)
    avg_rating = db.query(func.avg(Review.rating)).filter(
        Review.course_id == course_id,
        Review.rating > 0
    ).scalar()
    
    # Ako nema recenzija sa ocenom, postavi na 0
    if avg_rating is None:
        avg_rating = 0.0
    
    # Ažuriraj kurs
    course = db.query(Course).filter(Course.id == course_id).first()
    if course:
        course.average_rating = round(float(avg_rating), 1)
        db.commit()

def get_reviews_by_course_service(db: Session, course_id: int, skip: int = 0, limit: int = 5):
    reviews = review_repository.get_reviews_by_course(db, course_id, skip=skip, limit=limit)
    # Pribavi username za svakog korisnika
    result = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append({
            'id': r.id,
            'user_id': r.user_id,
            'course_id': r.course_id,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at,
            'username': user.username if user else None
        })
    return result 