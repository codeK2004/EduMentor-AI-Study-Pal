from fastapi import APIRouter
from pydantic import BaseModel
from ai.gemini import generate_text

router = APIRouter(prefix="/resources", tags=["Resources"])

class ResourceRequest(BaseModel):
    subject: str
    topic: str | None = None

@router.post("/")
def get_resources(data: ResourceRequest):
    topic_text = f" on {data.topic}" if data.topic else ""

    prompt = f"""
Suggest good learning resources for a student. 

Subject: {data.subject}{topic_text}

Give the answer in this format:

YouTube:
- title – short description

Articles:
- title – short description

Docs:
- title – short description
"""

    resources = generate_text(prompt)
    return {"resources": resources}
