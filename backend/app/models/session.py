from datetime import datetime, timezone

from pydantic import BaseModel, Field


class InterviewAnswer(BaseModel):
    questionIndex: int
    question: str
    answer: str
    score: int
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class InterviewSession(BaseModel):
    sessionId: str
    candidate: dict
    currentQuestion: int = 0
    totalQuestions: int = 0
    answers: list[InterviewAnswer] = Field(default_factory=list)
    status: str = "IN_PROGRESS"
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))