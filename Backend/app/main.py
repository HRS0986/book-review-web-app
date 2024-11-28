from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware

from .schema import Review, ReviewResponse
from . import crud
from .database import get_db, create_tables

create_tables()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/reviews", response_model=list[ReviewResponse], status_code=200)
def get_reviews(db: Session = Depends(get_db)):
    result = crud.get_reviews(db)
    return result

@app.post("/reviews", response_model=ReviewResponse, status_code=201)
def create_review(review: Review, db: Session = Depends(get_db)):
    result = crud.create_review(db, review)
    return result

@app.get("/reviews/{id}", response_model=ReviewResponse, status_code=200)
def get_review(id: int, db: Session = Depends(get_db)):
    review = crud.get_review(db, id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.put("/reviews/{id}", response_model=ReviewResponse, status_code=200)
def update_review(id: int, review: Review, db: Session = Depends(get_db)):
    review = crud.update_review(db, id, review)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.delete("/reviews/{id}", status_code=204)
def delete_review(id: int, db: Session = Depends(get_db)):
    try:
        crud.delete_review(db, id)
    except HTTPException as e:
        raise HTTPException(status_code=404, detail="Review not found")