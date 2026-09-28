from services.hindsight_service import (
    retain_feedback,
    recall_feedback
)
from services.llm_service import analyze_with_ai


def analyze_feedback(
    feedback: str,
    user_id: str = "anonymous"
):
    """
    Complete feedback intelligence pipeline:

    1. Store current feedback
    2. Recall historical feedback
    3. Send current + historical context to AI
    """

    # 1. Store current feedback
    retain_feedback(
        feedback=feedback,
        user_id=user_id
    )

    # 2. Recall related historical feedback
    memories = recall_feedback(
        query=feedback
    )

    # 3. Analyze current + historical feedback with AI
    ai_result = analyze_with_ai(
        feedback=feedback,
        historical_memories=memories
    )

    return {
        "feedback": feedback,
        "historical_memories": memories,
        "ai_analysis": ai_result
    }