import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

HINDSIGHT_BASE_URL = os.getenv(
    "HINDSIGHT_BASE_URL",
    "https://api.hindsight.vectorize.io"
)

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")

BANK_ID = os.getenv(
    "HINDSIGHT_BANK_ID",
    "devnovate-feedback"
)


def get_client():
    """Create and return a Hindsight client."""

    if not HINDSIGHT_API_KEY:
        raise RuntimeError(
            "HINDSIGHT_API_KEY is not configured."
        )

    return Hindsight(
        base_url=HINDSIGHT_BASE_URL,
        api_key=HINDSIGHT_API_KEY
    )


def retain_feedback(
    feedback: str,
    user_id: str = "anonymous"
):
    """Store user feedback in Hindsight."""

    client = get_client()

    try:
        content = (
            f"User ID: {user_id}\n"
            f"Feedback: {feedback}"
        )

        client.retain(
            bank_id=BANK_ID,
            content=content
        )

        return {
            "status": "stored",
            "bank_id": BANK_ID
        }

    except Exception as e:
        raise RuntimeError(
            f"Failed to store feedback in Hindsight: {e}"
        ) from e

    finally:
        client.close()


def recall_feedback(query: str):
    """Retrieve relevant historical feedback."""

    client = get_client()

    try:
        result = client.recall(
            bank_id=BANK_ID,
            query=query
        )

        memories = []

        for memory in result.results:
            memories.append({
                "type": memory.type,
                "text": memory.text
            })

        return memories

    except Exception as e:
        raise RuntimeError(
            f"Failed to retrieve feedback from Hindsight: {e}"
        ) from e

    finally:
        client.close()