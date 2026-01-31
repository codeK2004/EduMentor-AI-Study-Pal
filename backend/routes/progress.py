from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import json as json_lib

from models.user_progress import UserProgress
from models.study_plan import StudyPlan
from models.user import User
from utils.dependencies import get_current_user
from database.session import get_db

router = APIRouter()

class PlanInit(BaseModel):
    plan_id: int
    total_days: int

class CompleteDayRequest(BaseModel):
    plan_id: int
    day_number: int

def parse_progress_data(completed_day_numbers_str):
    """
    Parse progress data from database, handling both old and new formats
    Old format: "1,2,3" (comma-separated string)
    New format: '{"plan_id": [1,2,3]}' (JSON string)
    """
    if not completed_day_numbers_str:
        return {}
    
    try:
        # Try to parse as JSON first (new format)
        data = json_lib.loads(completed_day_numbers_str)
        if isinstance(data, dict):
            return data
        else:
            # If it's not a dict, treat as old format
            return {}
    except (json_lib.JSONDecodeError, ValueError):
        # If JSON parsing fails, it might be old comma-separated format
        # For now, return empty dict to start fresh
        return {}

@router.get("/")
def get_progress(
    plan_id: Optional[int] = None,
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
            completed_day_numbers="{}"  # Store as JSON: {"plan_id": [1,2,3]}
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    # Parse completed day numbers as JSON
    plan_progress = parse_progress_data(progress.completed_day_numbers)
    
    if plan_id:
        # Return progress for specific plan
        plan_completed_days = plan_progress.get(str(plan_id), [])
        
        # Get plan details
        plan = db.query(StudyPlan).filter(
            StudyPlan.id == plan_id,
            StudyPlan.user_id == current_user.id
        ).first()
        
        total_days = len(plan.plan_data.get("days", [])) if plan and plan.plan_data else 0
        completed_days = len(plan_completed_days)
        is_completed = completed_days >= total_days if total_days > 0 else False
        
        return {
            "plan_id": plan_id,
            "total_days": total_days,
            "completed_days": completed_days,
            "completed_day_numbers": plan_completed_days,
            "is_completed": is_completed
        }
    else:
        # Return overall progress across all plans
        all_completed_days = []
        total_days = 0
        
        # Get all user's plans
        user_plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).all()
        
        for plan in user_plans:
            plan_total = len(plan.plan_data.get("days", [])) if plan.plan_data else 0
            total_days += plan_total
            
            plan_completed = plan_progress.get(str(plan.id), [])
            all_completed_days.extend(plan_completed)
        
        return {
            "total_days": total_days,
            "completed_days": len(all_completed_days),
            "completed_day_numbers": all_completed_days
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
            total_days=0,
            completed_days=0,
            completed_day_numbers="{}"
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    # Parse existing progress
    plan_progress = parse_progress_data(progress.completed_day_numbers)
    
    # Initialize this plan's progress
    plan_progress[str(data.plan_id)] = []
    
    # Update the progress record
    progress.completed_day_numbers = json_lib.dumps(plan_progress)
    db.commit()
    db.refresh(progress)
    
    return {
        "plan_id": data.plan_id,
        "total_days": data.total_days,
        "completed_days": 0,
        "completed_day_numbers": [],
        "is_completed": False
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
    
    # Parse existing progress
    plan_progress = parse_progress_data(progress.completed_day_numbers)
    
    # Get or create progress for this plan
    plan_id_str = str(data.plan_id)
    if plan_id_str not in plan_progress:
        plan_progress[plan_id_str] = []
    
    # Add the new day if not already completed
    if data.day_number not in plan_progress[plan_id_str]:
        plan_progress[plan_id_str].append(data.day_number)
        plan_progress[plan_id_str].sort()  # Keep sorted
        
        # Update the progress record
        progress.completed_day_numbers = json_lib.dumps(plan_progress)
        
        # Update total completed days across all plans
        total_completed = sum(len(days) for days in plan_progress.values())
        progress.completed_days = total_completed
        
        db.commit()
        db.refresh(progress)
        print(f"✅ Plan {data.plan_id} - Day {data.day_number} completed! Plan progress: {len(plan_progress[plan_id_str])} days")
    
    # Get plan details for completion check
    plan = db.query(StudyPlan).filter(
        StudyPlan.id == data.plan_id,
        StudyPlan.user_id == current_user.id
    ).first()
    
    total_days = len(plan.plan_data.get("days", [])) if plan and plan.plan_data else 0
    completed_days = len(plan_progress[plan_id_str])
    is_completed = completed_days >= total_days if total_days > 0 else False
    
    return {
        "plan_id": data.plan_id,
        "total_days": total_days,
        "completed_days": completed_days,
        "completed_day_numbers": plan_progress[plan_id_str],
        "is_completed": is_completed
    }

@router.get("/plan/{plan_id}")
def get_plan_progress(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_progress(plan_id=plan_id, current_user=current_user, db=db)

@router.post("/reset")
def reset_progress(
    plan_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get user's progress
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    if not progress:
        return {"message": "No progress to reset"}
    
    # Parse existing progress
    plan_progress = parse_progress_data(progress.completed_day_numbers)
    
    if plan_id:
        # Reset specific plan's progress
        plan_id_str = str(plan_id)
        if plan_id_str in plan_progress:
            plan_progress[plan_id_str] = []
            
            # Update total completed days
            total_completed = sum(len(days) for days in plan_progress.values())
            progress.completed_days = total_completed
            progress.completed_day_numbers = json_lib.dumps(plan_progress)
            db.commit()
        
        return {
            "plan_id": plan_id,
            "total_days": 0,
            "completed_days": 0,
            "completed_day_numbers": [],
            "is_completed": False
        }
    else:
        # Reset all progress
        progress.total_days = 0
        progress.completed_days = 0
        progress.completed_day_numbers = "{}"
        db.commit()
        
        return {
            "total_days": 0,
            "completed_days": 0,
            "completed_day_numbers": []
        }
