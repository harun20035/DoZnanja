from models.reviewCourses_model import Review
from sqlalchemy.orm import Session
from typing import List

def add_review(db: Session, review: Review) -> Review:
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_reviews_by_course(db: Session, course_id: int, skip: int = 0, limit: int = 5) -> List[Review]:
    return db.query(Review).filter(Review.course_id == course_id).order_by(Review.created_at.desc()).offset(skip).limit(limit).all() 