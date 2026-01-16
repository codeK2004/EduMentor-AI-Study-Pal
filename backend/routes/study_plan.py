from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json, re

from models.student import StudyRequest
from models.study_plan import StudyPlan
from models.user import User

from ai.gemini import generate_text
from utils.dependencies import get_current_user
from database.session import get_db

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

    plan_json = json.loads(match.group())

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

    # Return the plan data
    return plan_json


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

    return [
        {
            "id": p.id,
            "subject": p.subject,
            "deadline_days": p.deadline_days,
            "created_at": p.created_at,
        }
        for p in plans
    ]


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

    # Get user's overall progress
    from models.user_progress import UserProgress
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).first()
    
    completed_days = progress.completed_days if progress else 0
    total_days = len(plan.plan_data.get("days", []))

    return {
        "id": plan.id,
        "subject": plan.subject,
        "weak_areas": plan.weak_areas,
        "deadline_days": plan.deadline_days,
        "plan_data": plan.plan_data,
        "created_at": plan.created_at,
        "completed_days": completed_days,
        "total_days": total_days,
        "is_completed": completed_days >= total_days if total_days > 0 else False
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

    plan.plan_data = json.loads(match.group())
    db.commit()
    db.refresh(plan)

    return plan.plan_data
