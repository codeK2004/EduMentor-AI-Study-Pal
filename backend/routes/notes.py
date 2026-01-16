from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/notes", tags=["Notes"])

# In-memory notes store (v1)
notes_db = []

class Note(BaseModel):
    subject: str
    topic: str | None = None
    content: str

@router.post("/")
def add_note(note: Note):
    notes_db.append(note)
    return {"message": "Note added successfully"}

@router.get("/", response_model=List[Note])
def get_notes():
    return notes_db
