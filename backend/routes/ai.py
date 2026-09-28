from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.hindsight_service import recall_feedback
from services.llm_service import analyze_with_ai

from services.hindsight_stats import (
    get_memory_stats,
    get_memory_timeseries
)
router = APIRouter(
    prefix="/api/agent",
    tags=["AI Agent"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    """
    Receive a user question, recall relevant historical feedback
    from Hindsight, and generate an AI response using Gemini.
    """

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    try:
        # 1. Recall relevant historical feedback
        memories = recall_feedback(request.message)

        # 2. Analyze the current question together
        #    with the recalled historical context
        answer = analyze_with_ai(
            feedback=request.message,
            historical_memories=memories
        )

        return {
            "message": request.message,
            "answer": answer,
            "memories_used": memories
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/insights")
def get_ai_insights():
    """
    Generate overall AI insights from historical feedback
    stored in Hindsight.
    """

    try:
        # Ask Hindsight for memories related to overall feedback patterns
        memories = recall_feedback(
            "overall user feedback recurring issues trends sentiment "
            "complaints improvements recommendations"
        )

        # Generate an overall analysis using Gemini
        answer = analyze_with_ai(
            feedback=(
                "Provide an overall analysis of the user's feedback. "
                "Identify the most important recurring issues, "
                "major trends, sentiment patterns, and actionable "
                "recommendations for the product team."
            ),
            historical_memories=memories
        )

        return {
            "answer": answer,
            "memories_used": memories
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.post("/before-after")
def hindsight_before_after(request: ChatRequest):
    """
    Demonstrate the difference between AI analysis
    without Hindsight memory and with Hindsight memory.
    """

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    try:
        # BEFORE: analyze only the current feedback
        before_answer = analyze_with_ai(
            feedback=request.message,
            historical_memories=[]
        )

        # AFTER: recall historical feedback from Hindsight
        memories = recall_feedback(request.message)

        after_answer = analyze_with_ai(
            feedback=request.message,
            historical_memories=memories
        )

        return {
            "feedback": request.message,
            "before": {
                "answer": before_answer,
                "memories_used": 0
            },
            "after": {
                "answer": after_answer,
                "memories_used": len(memories),
                "memories": memories
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/memory-stats")
def memory_stats():
    try:
        stats = get_memory_stats()
        timeseries = get_memory_timeseries("7d")

        return {
            "stats": stats,
            "timeseries": timeseries
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.post("/before-after")
def hindsight_before_after(request: ChatRequest):
    """
    Demonstrate AI analysis without Hindsight
    versus analysis with Hindsight memory.
    """

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    try:
        # BEFORE: no historical memory
        before_answer = analyze_with_ai(
            feedback=request.message,
            historical_memories=[]
        )

        # AFTER: retrieve historical memory
        memories = recall_feedback(request.message)

        after_answer = analyze_with_ai(
            feedback=request.message,
            historical_memories=memories
        )

        return {
            "feedback": request.message,

            "before": {
                "answer": before_answer,
                "memories_used": 0
            },

            "after": {
                "answer": after_answer,
                "memories_used": len(memories),
                "memories": memories
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )