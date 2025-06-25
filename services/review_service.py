from sqlalchemy.orm import Session
from models.reviewCourses_model import Review
from repositories import review_repository
from schemas.review_schema import ReviewCreate
from models.user_model import User

def add_review_service(db: Session, review_data: ReviewCreate, user_id: int):
    review = Review(
        user_id=user_id,
        course_id=review_data.course_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    return review_repository.add_review(db, review)

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