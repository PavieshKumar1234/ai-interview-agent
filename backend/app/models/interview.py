from typing import Optional
from pydantic import BaseModel


class Candidate(BaseModel):
    member: dict
    missions: list[dict] = []
    signals: dict = {}


class InterviewRequest(BaseModel):
    sessionId: str
    candidate: Optional[Candidate] = None
    message: Optional[str] = None
    questionIndex: int = 0

class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None
    questionIndex: int = 0
    totalQuestions: int = 0
    score: Optional[float] = None

class Feedback(BaseModel):
    summary: str
    strengths: list[str]
    gaps: list[str]
    next: list[str]


class InterviewResponse(BaseModel):
    reply: str
    done: bool
    feedback: Optional[Feedback] = None
    questionIndex: int = 0
    totalQuestions: int = 0
    score: Optional[float] = None