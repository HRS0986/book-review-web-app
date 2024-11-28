from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .schema import Review, ReviewResponse
from . import crud
from .database import get_db, create_tables

create_tables()

app = FastAPI()

@app.get("/reviews", response_model=list[ReviewResponse], status_code=200)
def get_reviews(db: Session = Depends(get_db)):
    result = crud.get_reviews(db)
    return result

@app.post("/reviews", response_model=ReviewResponse, status_code=201)
def create_review(review: Review, db: Session = Depends(get_db)):
    result = crud.create_review(db, review)
    return result

@app.get("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = crud.get_review(db, review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.put("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
def update_review(review_id: int, review: Review, db: Session = Depends(get_db)):
    review = crud.update_review(db, review_id, review)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.delete("/reviews/{review_id}", status_code=204)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    try:
        crud.delete_review(db, review_id)
    except HTTPException as e:
        raise HTTPException(status_code=404, detail="Review not found")