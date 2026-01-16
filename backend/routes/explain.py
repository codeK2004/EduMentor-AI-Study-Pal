from fastapi import APIRouter
from pydantic import BaseModel
from ai.gemini import generate_text

router = APIRouter(prefix="/explain", tags=["AI Explain"])

class ExplainRequest(BaseModel):
    question: str

@router.post("/")
def explain_topic(data: ExplainRequest):
    prompt = f"""
Explain the following topic in very simple terms.
Use easy language, an example, and an analogy.

Topic: {data.question}
"""

    explanation = generate_text(prompt)
    return {"explanation": explanation}
