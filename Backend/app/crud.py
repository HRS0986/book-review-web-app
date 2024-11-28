from typing import List, Type, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .models import Review as ReviewEntity
from .schema import Review

def convert_to_orm(review_schema: Review) -> ReviewEntity:
    return ReviewEntity(
        book_title=review_schema.book_title,
        author=review_schema.author,
        rating=review_schema.rating,
        review=review_schema.review
    )

def get_reviews(db: Session)  -> List[Type[ReviewEntity]]:
    return db.query(ReviewEntity).all()

def create_review(db: Session, review: Review) -> ReviewEntity:
    review = convert_to_orm(review)
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_review(db: Session, review_id: int) -> Optional[ReviewEntity]:
    return db.query(ReviewEntity).filter(ReviewEntity.id == review_id).first()

def update_review(db: Session, review_id: int, review: Review) -> Optional[ReviewEntity]:
    # review = convert_to_orm(review)
    db.query(ReviewEntity).filter(ReviewEntity.id == review_id).update(review.dict())
    db.commit()
    return db.query(ReviewEntity).filter(ReviewEntity.id == review_id).first()

def delete_review(db: Session, review_id: int):
    db_review = db.query(ReviewEntity).filter(ReviewEntity.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(db_review)
    db.commit()