from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class Review(BaseModel):
    book_title: str
    author: str
    rating: int
    review: str

class ReviewResponse(BaseModel):
    id: int
    book_title: str
    author: str
    rating: int
    review: str
    date_added: datetime