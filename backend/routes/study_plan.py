from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json as json_lib, re

from models.student import StudyRequest
from models.study_plan import StudyPlan
from models.user import User

from ai.gemini import generate_text
from utils.dependencies import get_current_user
from database.session import get_db

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

router = APIRouter(prefix="/study", tags=["Study Plans"])


# ==============================
# CREATE STUDY PLAN (AI + SAVE)
# ==============================
@router.post("/plan")
def create_study_plan(
    data: StudyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prompt = f"""
Create a {data.deadline_days}-day study plan for {data.subject}.
Weak areas: {", ".join(data.weak_areas)}

Return ONLY JSON in this format:
{{
  "days": [
    {{
      "day": 1,
      "topic": "Topic name",
      "tasks": ["Task 1", "Task 2"]
    }}
  ]
}}
"""

    raw = generate_text(prompt)

    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise HTTPException(status_code=500, detail="AI response invalid")

    plan_json = json_lib.loads(match.group())

    study_plan = StudyPlan(
        user_id=current_user.id,
        subject=data.subject,
        weak_areas=", ".join(data.weak_areas),
        deadline_days=data.deadline_days,
        plan_data=plan_json,
    )

    db.add(study_plan)
    db.commit()
    db.refresh(study_plan)

    # Initialize progress for this specific plan
    from models.user_progress import UserProgress
    import json
    
    # Get or create user progress
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
    total_days = len(plan_json.get("days", []))
    plan_progress[str(study_plan.id)] = []
    
    # Update the progress record
    progress.completed_day_numbers = json_lib.dumps(plan_progress)
    db.commit()

    # Return the plan data with ID
    return {
        "plan_id": study_plan.id,
        "plan_data": plan_json
    }


# ==============================
# LIST USER STUDY PLANS
# ==============================
@router.get("/plans")
def list_study_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plans = (
        db.query(StudyPlan)
        .filter(StudyPlan.user_id == current_user.id)
        .order_by(StudyPlan.created_at.desc())
        .all()
    )

    # Get progress for each plan
    from models.user_progress import UserProgress
    
    # Get user's progress record
    progress_record = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    plan_progress = {}
    
    if progress_record:
        plan_progress = parse_progress_data(progress_record.completed_day_numbers)
    
    result = []
    
    for p in plans:
        plan_completed_days = plan_progress.get(str(p.id), [])
        completed_days = len(plan_completed_days)
        total_days = len(p.plan_data.get("days", [])) if p.plan_data else 0
        is_completed = completed_days >= total_days if total_days > 0 else False
        
        result.append({
            "id": p.id,
            "subject": p.subject,
            "deadline_days": p.deadline_days,
            "created_at": p.created_at,
            "completed_days": completed_days,
            "total_days": total_days,
            "is_completed": is_completed
        })

    return result


# ==============================
# GET SINGLE STUDY PLAN
# ==============================
@router.get("/plans/{plan_id}")
def get_study_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.user_id == current_user.id,
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    # Get plan-specific progress
    from models.user_progress import UserProgress
    
    progress_record = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    completed_days = 0
    is_completed = False
    
    if progress_record:
        plan_progress = parse_progress_data(progress_record.completed_day_numbers)
        if isinstance(plan_progress, dict):
            plan_completed_days = plan_progress.get(str(plan_id), [])
            completed_days = len(plan_completed_days)
    
    total_days = len(plan.plan_data.get("days", []))
    is_completed = completed_days >= total_days if total_days > 0 else False

    return {
        "id": plan.id,
        "subject": plan.subject,
        "weak_areas": plan.weak_areas,
        "deadline_days": plan.deadline_days,
        "plan_data": plan.plan_data,
        "created_at": plan.created_at,
        "completed_days": completed_days,
        "total_days": total_days,
        "is_completed": is_completed
    }


# ==============================
# DELETE STUDY PLAN
# ==============================
@router.delete("/plans/{plan_id}")
def delete_study_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.user_id == current_user.id,
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    db.delete(plan)
    db.commit()

    return {"message": "Study plan deleted successfully"}


# ==============================
# REGENERATE STUDY PLAN
# ==============================
@router.put("/plans/{plan_id}/regenerate")
def regenerate_study_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = (
        db.query(StudyPlan)
        .filter(
            StudyPlan.id == plan_id,
            StudyPlan.user_id == current_user.id,
        )
        .first()
    )

    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    prompt = f"""
Create a {plan.deadline_days}-day study plan for {plan.subject}.
Weak areas: {plan.weak_areas}

Return ONLY JSON in this format:
{{
  "days": [
    {{
      "day": 1,
      "topic": "Topic name",
      "tasks": ["Task 1", "Task 2"]
    }}
  ]
}}
"""

    raw = generate_text(prompt)
    match = re.search(r"\{.*\}", raw, re.DOTALL)

    if not match:
        raise HTTPException(status_code=500, detail="AI generation failed")

    plan.plan_data = json_lib.loads(match.group())
    db.commit()
    db.refresh(plan)

    return plan.plan_data
