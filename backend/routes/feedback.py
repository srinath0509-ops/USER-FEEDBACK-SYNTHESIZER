from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from database import engine
from models import Feedback
from services.analysis_service import analyze_feedback


router = APIRouter(
    prefix="/api/feedback",
    tags=["Feedback"]
)


# -----------------------------
# Database session
# -----------------------------
def get_db():
    with Session(engine) as session:
        yield session


# -----------------------------
# AI Feedback Analysis
# -----------------------------
class FeedbackRequest(BaseModel):
    feedback: str
    user_id: str = "anonymous"


@router.post("/analyze")
def analyze(request: FeedbackRequest):

    return analyze_feedback(
        feedback=request.feedback,
        user_id=request.user_id
    )


# -----------------------------
# Get Feedback
# -----------------------------
@router.get("")
def get_feedback(
    limit: int = 100,
    sentiment: str | None = None,
    theme: str | None = None,
    db: Session = Depends(get_db)
):

    statement = select(Feedback)

    # Sentiment filter
    if sentiment and sentiment.lower() != "all":
        statement = statement.where(
            func.lower(Feedback.sentiment) == sentiment.lower()
        )

    # Theme filter
    if theme and theme.lower() != "all":
        statement = statement.where(
            func.lower(Feedback.theme) == theme.lower()
        )

    # Latest records first
    statement = statement.order_by(
        Feedback.timestamp.desc()
    )

    statement = statement.limit(limit)

    feedback_records = db.execute(
        statement
    ).scalars().all()

    return feedback_records