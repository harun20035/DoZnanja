from models.reviewCourses_model import Review
from sqlalchemy.orm import Session
from typing import List, Optional

def add_review(db: Session, review: Review) -> Review:
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_user_review_for_course(db: Session, user_id: int, course_id: int) -> Optional[Review]:
    """Proveri da li korisnik već ima ocenu za kurs"""
    return db.query(Review).filter(
        Review.user_id == user_id,
        Review.course_id == course_id
    ).first()

def update_review_rating(db: Session, review_id: int, new_rating: float) -> Review:
    """Ažuriraj ocenu postojeće recenzije"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if review:
        review.rating = new_rating
        db.commit()
        db.refresh(review)
    return review

def get_reviews_by_course(db: Session, course_id: int, skip: int = 0, limit: int = 5) -> List[Review]:
    return db.query(Review).filter(Review.course_id == course_id).order_by(Review.created_at.desc()).offset(skip).limit(limit).all() 