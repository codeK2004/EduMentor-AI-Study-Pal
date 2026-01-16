from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)

    # 🔥 THIS MUST MATCH DB COLUMN NAME
    hashed_password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # relationship
    study_plans = relationship("StudyPlan", back_populates="user")
