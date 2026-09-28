import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not configured in .env")

client = Groq(api_key=GROQ_API_KEY)


def analyze_with_ai(feedback: str, historical_memories: list):

    historical_context = "\n".join(
        memory["text"] for memory in historical_memories
    )

    prompt = f"""
You are an AI feedback analyst for the DEVNOVATE platform.

Analyze the new user feedback together with relevant historical feedback.

NEW USER FEEDBACK:
{feedback}

HISTORICAL FEEDBACK:
{historical_context}

Return the analysis using exactly these sections:

Sentiment:
Main Theme:
Recurring Issue:
Change/Trend:
Actionable Recommendation:
Summary:

Keep the analysis concise, factual, and useful for a product team.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
        )

        answer = response.choices[0].message.content

        if not answer:
            raise RuntimeError("Groq returned an empty response.")

        return answer

    except Exception as e:

        error_text = str(e)

        if "429" in error_text or "rate_limit" in error_text.lower():
            raise RuntimeError(
                "Groq API rate limit reached. Please try again later."
            ) from e

        raise RuntimeError(
            f"Groq AI analysis failed: {e}"
        ) from e