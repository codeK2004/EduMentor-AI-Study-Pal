from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from models.user_progress import UserProgress
from models.user import User
from utils.dependencies import get_current_user
from database.session import get_db

router = APIRouter()

class PlanInit(BaseModel):
    total_days: int

class CompleteDayRequest(BaseModel):
    day_number: int

@router.get("/")
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get or create progress for user
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if not progress:
        # Create new progress entry
        progress = UserProgress(
            user_id=current_user.id,
            total_days=0,
            completed_days=0,
            completed_day_numbers=""
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    # Parse completed day numbers
    completed_days_list = []
    if progress.completed_day_numbers:
        completed_days_list = [int(d) for d in progress.completed_day_numbers.split(",") if d.strip()]
    
    return {
        "total_days": progress.total_days,
        "completed_days": progress.completed_days,
        "completed_day_numbers": completed_days_list
    }

@router.post("/init-plan")
def init_plan(
    data: PlanInit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get or create progress for user
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            total_days=data.total_days,
            completed_days=0,
            completed_day_numbers=""
        )
        db.add(progress)
    else:
        # Add to existing total days
        progress.total_days += data.total_days
    
    db.commit()
    db.refresh(progress)
    
    # Parse completed day numbers
    completed_days_list = []
    if progress.completed_day_numbers:
        completed_days_list = [int(d) for d in progress.completed_day_numbers.split(",") if d.strip()]
    
    return {
        "total_days": progress.total_days,
        "completed_days": progress.completed_days,
        "completed_day_numbers": completed_days_list
    }

@router.post("/complete-day")
def complete_day(
    data: CompleteDayRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get progress for user
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    # Parse existing completed days
    completed_days_set = set()
    if progress.completed_day_numbers:
        completed_days_set = set(int(d) for d in progress.completed_day_numbers.split(",") if d.strip())
    
    # Add the new day if not already completed
    if data.day_number not in completed_days_set:
        completed_days_set.add(data.day_number)
        progress.completed_days = len(completed_days_set)
        progress.completed_day_numbers = ",".join(str(d) for d in sorted(completed_days_set))
        db.commit()
        db.refresh(progress)
        print(f"✅ Day {data.day_number} completed! Total: {progress.completed_days}/{progress.total_days}")
    
    # Parse completed day numbers for response
    completed_days_list = [int(d) for d in progress.completed_day_numbers.split(",") if d.strip()]
    
    return {
        "total_days": progress.total_days,
        "completed_days": progress.completed_days,
        "completed_day_numbers": completed_days_list
    }

@router.post("/reset")
def reset_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Reset user's progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if progress:
        progress.total_days = 0
        progress.completed_days = 0
        progress.completed_day_numbers = ""
        db.commit()
        db.refresh(progress)
    
    return {
        "total_days": 0,
        "completed_days": 0,
        "completed_day_numbers": []
    }
