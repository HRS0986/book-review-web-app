from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from .database import Base

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, index=True)
    book_title = Column(String(255), index=True)
    author = Column(String(255), index=True)
    review = Column(String(255), index=True)
    date_added = Column(DateTime, default=datetime.utcnow)
