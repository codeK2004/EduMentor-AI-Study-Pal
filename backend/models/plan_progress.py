from sqlalchemy import Column, Integer, ForeignKey, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.base import Base

class PlanProgress(Base):
    __tablename__ = "plan_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("study_plans.id"), nullable=False)
    total_days = Column(Integer, default=0)
    completed_days = Column(Integer, default=0)
    completed_day_numbers = Column(String, default="")  # Store as comma-separated: "1,3,5"
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    study_plan = relationship("StudyPlan")