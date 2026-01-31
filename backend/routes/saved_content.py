from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from models.saved_content import SavedQuiz, SavedResource, SavedExplanation, UserNote
from models.user import User
from utils.dependencies import get_current_user
from database.session import get_db

router = APIRouter()

# Pydantic models for requests
class SaveQuizRequest(BaseModel):
    topic: str
    questions: dict
    score: int
    total_questions: int

class SaveResourceRequest(BaseModel):
    title: str
    url: str
    description: Optional[str] = ""
    category: Optional[str] = "General"

class SaveExplanationRequest(BaseModel):
    topic: str
    question: str
    explanation: str

class CreateNoteRequest(BaseModel):
    title: str
    content: str
    category: Optional[str] = "General"

class UpdateNoteRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None

# ==============================
# SAVED QUIZZES
# ==============================
@router.post("/quizzes")
def save_quiz(
    data: SaveQuizRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_quiz = SavedQuiz(
        user_id=current_user.id,
        topic=data.topic,
        questions=data.questions,
        score=data.score,
        total_questions=data.total_questions
    )
    db.add(saved_quiz)
    db.commit()
    db.refresh(saved_quiz)
    
    return {
        "id": saved_quiz.id,
        "message": "Quiz saved successfully",
        "score": f"{data.score}/{data.total_questions}"
    }

@router.get("/quizzes")
def get_saved_quizzes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quizzes = db.query(SavedQuiz).filter(
        SavedQuiz.user_id == current_user.id
    ).order_by(SavedQuiz.created_at.desc()).all()
    
    return [
        {
            "id": quiz.id,
            "topic": quiz.topic,
            "score": quiz.score,
            "total_questions": quiz.total_questions,
            "percentage": round((quiz.score / quiz.total_questions) * 100),
            "created_at": quiz.created_at,
            "questions": quiz.questions
        }
        for quiz in quizzes
    ]

@router.delete("/quizzes/{quiz_id}")
def delete_saved_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(SavedQuiz).filter(
        SavedQuiz.id == quiz_id,
        SavedQuiz.user_id == current_user.id
    ).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    db.delete(quiz)
    db.commit()
    
    return {"message": "Quiz deleted successfully"}

# ==============================
# SAVED RESOURCES
# ==============================
@router.post("/resources")
def save_resource(
    data: SaveResourceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_resource = SavedResource(
        user_id=current_user.id,
        title=data.title,
        url=data.url,
        description=data.description,
        category=data.category
    )
    db.add(saved_resource)
    db.commit()
    db.refresh(saved_resource)
    
    return {
        "id": saved_resource.id,
        "message": "Resource saved successfully"
    }

@router.get("/resources")
def get_saved_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resources = db.query(SavedResource).filter(
        SavedResource.user_id == current_user.id
    ).order_by(SavedResource.created_at.desc()).all()
    
    return [
        {
            "id": resource.id,
            "title": resource.title,
            "url": resource.url,
            "description": resource.description,
            "category": resource.category,
            "created_at": resource.created_at
        }
        for resource in resources
    ]

@router.delete("/resources/{resource_id}")
def delete_saved_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(SavedResource).filter(
        SavedResource.id == resource_id,
        SavedResource.user_id == current_user.id
    ).first()
    
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    db.delete(resource)
    db.commit()
    
    return {"message": "Resource deleted successfully"}

# ==============================
# SAVED EXPLANATIONS
# ==============================
@router.post("/explanations")
def save_explanation(
    data: SaveExplanationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    saved_explanation = SavedExplanation(
        user_id=current_user.id,
        topic=data.topic,
        question=data.question,
        explanation=data.explanation
    )
    db.add(saved_explanation)
    db.commit()
    db.refresh(saved_explanation)
    
    return {
        "id": saved_explanation.id,
        "message": "Explanation saved successfully"
    }

@router.get("/explanations")
def get_saved_explanations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    explanations = db.query(SavedExplanation).filter(
        SavedExplanation.user_id == current_user.id
    ).order_by(SavedExplanation.created_at.desc()).all()
    
    return [
        {
            "id": explanation.id,
            "topic": explanation.topic,
            "question": explanation.question,
            "explanation": explanation.explanation,
            "created_at": explanation.created_at
        }
        for explanation in explanations
    ]

@router.delete("/explanations/{explanation_id}")
def delete_saved_explanation(
    explanation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    explanation = db.query(SavedExplanation).filter(
        SavedExplanation.id == explanation_id,
        SavedExplanation.user_id == current_user.id
    ).first()
    
    if not explanation:
        raise HTTPException(status_code=404, detail="Explanation not found")
    
    db.delete(explanation)
    db.commit()
    
    return {"message": "Explanation deleted successfully"}

# ==============================
# USER NOTES
# ==============================
@router.post("/notes")
def create_note(
    data: CreateNoteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = UserNote(
        user_id=current_user.id,
        title=data.title,
        content=data.content,
        category=data.category
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "category": note.category,
        "created_at": note.created_at,
        "updated_at": note.updated_at
    }

@router.get("/notes")
def get_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(UserNote).filter(
        UserNote.user_id == current_user.id
    ).order_by(UserNote.updated_at.desc()).all()
    
    return [
        {
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "category": note.category,
            "created_at": note.created_at,
            "updated_at": note.updated_at
        }
        for note in notes
    ]

@router.put("/notes/{note_id}")
def update_note(
    note_id: int,
    data: UpdateNoteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if data.title is not None:
        note.title = data.title
    if data.content is not None:
        note.content = data.content
    if data.category is not None:
        note.category = data.category
    
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "category": note.category,
        "created_at": note.created_at,
        "updated_at": note.updated_at
    }

@router.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(UserNote).filter(
        UserNote.id == note_id,
        UserNote.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    
    return {"message": "Note deleted successfully"}