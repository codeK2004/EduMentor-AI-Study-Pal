from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel

from database.base import Base

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    subject = Column(String, nullable=False)
    weak_areas = Column(String)
    deadline_days = Column(Integer)
    plan_data = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="study_plans")

class StudyPlanOut(BaseModel):
    id: int
    subject: str
    deadline_days: int
    created_at: datetime

    class Config:
        from_attributes = True