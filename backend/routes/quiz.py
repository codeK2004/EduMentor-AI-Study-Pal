from fastapi import APIRouter
from ai.gemini import generate_text
import json, re

router = APIRouter()

@router.get("/generate")
def generate_quiz(topic: str):
    prompt = f"""
Generate 5 MCQs on {topic}.
Return ONLY valid JSON without trailing commas.

FORMAT:
{{
  "questions": [
    {{
      "question": "string",
      "options": [
        {{"key": "A", "text": "Option text"}},
        {{"key": "B", "text": "Option text"}},
        {{"key": "C", "text": "Option text"}},
        {{"key": "D", "text": "Option text"}}
      ],
      "answer": "C",
      "explanation": "Why this answer is correct"
    }}
  ]
}}

IMPORTANT: Do not include trailing commas in the JSON.
"""

    raw = generate_text(prompt)

    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        return {"questions": []}

    json_str = match.group()
    
    # Clean up common JSON issues
    json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)  # Remove trailing commas
    json_str = re.sub(r'\n\s*', ' ', json_str)  # Remove extra whitespace
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Raw JSON: {json_str}")
        return {"questions": []}
