from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from routes.feedback import router as feedback_router
from routes.ai import router as ai_router

from database import engine
from models import Feedback
from services.hindsight_service import recall_feedback


app = FastAPI(
    title="DEVNOVATE User Feedback Synthesizer",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Routers
# --------------------------------------------------

app.include_router(feedback_router)
app.include_router(ai_router)


# --------------------------------------------------
# Database session
# --------------------------------------------------

def get_db():
    with Session(engine) as session:
        yield session


# --------------------------------------------------
# Basic APIs
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "DEVNOVATE Feedback Synthesizer API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------------------------
# Analytics API
# --------------------------------------------------

@app.get("/analytics/summary")
def analytics_summary(
    product: str | None = None,
    db: Session = Depends(get_db)
):

    base_filter = []

    if product:
        base_filter.append(
            func.lower(Feedback.product) == product.lower()
        )

    # ----------------------------------------------
    # Total feedback
    # ----------------------------------------------

    total_query = select(
        func.count()
    ).select_from(Feedback)

    if base_filter:
        total_query = total_query.where(*base_filter)

    total_feedback = db.execute(
        total_query
    ).scalar() or 0


    # ----------------------------------------------
    # Sentiment counts
    # ----------------------------------------------

    sentiment_query = (
        select(
            Feedback.sentiment,
            func.count(Feedback.feedback_id)
        )
        .group_by(Feedback.sentiment)
    )

    if base_filter:
        sentiment_query = sentiment_query.where(*base_filter)

    sentiment_rows = db.execute(
        sentiment_query
    ).all()

    sentiment_counts = {
        sentiment: count
        for sentiment, count in sentiment_rows
    }


    # ----------------------------------------------
    # Priority counts
    # ----------------------------------------------

    priority_query = (
        select(
            Feedback.issue_priority,
            func.count(Feedback.feedback_id)
        )
        .group_by(Feedback.issue_priority)
        .order_by(
            func.count(Feedback.feedback_id).desc()
        )
    )

    if base_filter:
        priority_query = priority_query.where(*base_filter)

    priority_rows = db.execute(
        priority_query
    ).all()

    priority_counts = {
        priority: count
        for priority, count in priority_rows
    }


    # ----------------------------------------------
    # Top feedback themes
    # ----------------------------------------------

    theme_query = (
        select(
            Feedback.theme,
            func.count(Feedback.feedback_id)
        )
        .group_by(Feedback.theme)
        .order_by(
            func.count(Feedback.feedback_id).desc()
        )
        .limit(10)
    )

    if base_filter:
        theme_query = theme_query.where(*base_filter)

    theme_rows = db.execute(
        theme_query
    ).all()

    top_themes = [
        {
            "theme": theme,
            "count": count
        }
        for theme, count in theme_rows
    ]


    # ----------------------------------------------
    # Return analytics
    # ----------------------------------------------

    return {
        "product": product or "All Products",

        "total_feedback": total_feedback,

        "sentiment": {
            "positive": sentiment_counts.get(
                "Positive", 0
            ),
            "negative": sentiment_counts.get(
                "Negative", 0
            ),
            "neutral": sentiment_counts.get(
                "Neutral", 0
            )
        },

        "issue_priority": priority_counts,

        "top_themes": top_themes
    }


# --------------------------------------------------
# Dashboard API
# --------------------------------------------------

@app.get("/dashboard")
def dashboard(
    query: str = "delivery shipping customer service",
    db: Session = Depends(get_db)
):

    # ----------------------------------------------
    # Total feedback
    # ----------------------------------------------

    total = db.query(
        func.count(Feedback.feedback_id)
    ).scalar()


    # ----------------------------------------------
    # Negative feedback
    # ----------------------------------------------

    negative = db.query(
        func.count(Feedback.feedback_id)
    ).filter(
        func.lower(Feedback.sentiment) == "negative"
    ).scalar()


    # ----------------------------------------------
    # High / Critical priority feedback
    # ----------------------------------------------

    high_priority = db.query(
        func.count(Feedback.feedback_id)
    ).filter(
        func.lower(
            Feedback.issue_priority
        ).in_(
            ["high", "critical"]
        )
    ).scalar()


    # ----------------------------------------------
    # Top feedback themes
    # ----------------------------------------------

    top_themes = db.execute(
        select(
            Feedback.theme,
            func.count(
                Feedback.feedback_id
            ).label("count")
        )
        .group_by(
            Feedback.theme
        )
        .order_by(
            func.count(
                Feedback.feedback_id
            ).desc()
        )
        .limit(10)
    ).all()


    # ----------------------------------------------
    # Historical feedback from Hindsight
    # ----------------------------------------------

    memory = recall_feedback(query)


    # ----------------------------------------------
    # Return dashboard data
    # ----------------------------------------------

    return {
        "summary": {
            "total_feedback": total,
            "negative_feedback": negative,
            "high_priority_feedback": high_priority
        },

        "top_themes": [
            {
                "theme": row.theme,
                "count": row.count
            }
            for row in top_themes
        ],

        "historical_feedback": [
            {
                "id": index,
                "text": item["text"]
            }
            for index, item in enumerate(memory)
        ]
    }