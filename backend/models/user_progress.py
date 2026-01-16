from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from database.base import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    total_days = Column(Integer, default=0)
    completed_days = Column(Integer, default=0)
    completed_day_numbers = Column(String, default="")  # Store as comma-separated: "1,3,5"

    # Relationship
    user = relationship("User")
