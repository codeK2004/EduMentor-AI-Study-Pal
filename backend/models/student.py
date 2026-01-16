from pydantic import BaseModel
from typing import List

class StudyRequest(BaseModel):
    subject: str
    weak_areas: List[str]
    deadline_days: int
