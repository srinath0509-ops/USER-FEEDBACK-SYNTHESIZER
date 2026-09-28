import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv(
    "HINDSIGHT_BASE_URL",
    "https://api.hindsight.vectorize.io"
)

API_KEY = os.getenv("HINDSIGHT_API_KEY")
BANK_ID = os.getenv(
    "HINDSIGHT_BANK_ID",
    "devnovate-feedback"
)


def get_headers():
    return {
        "Authorization": f"Bearer {API_KEY}"
    }


def get_memory_stats():
    response = requests.get(
        f"{BASE_URL}/v1/default/banks/{BANK_ID}/stats",
        headers=get_headers(),
        timeout=20
    )

    response.raise_for_status()
    return response.json()


def get_memory_timeseries(period="7d"):
    response = requests.get(
        f"{BASE_URL}/v1/default/banks/{BANK_ID}/stats/memories-timeseries",
        headers=get_headers(),
        params={
            "period": period,
            "time_field": "created_at"
        },
        timeout=20
    )

    response.raise_for_status()
    return response.json()