import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

client = Hindsight(
    base_url=os.getenv("HINDSIGHT_BASE_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY")
)

bank_id = os.getenv("HINDSIGHT_BANK_ID")

# 1. Store a test memory
print("\n--- RETAIN TEST ---")

client.retain(
    bank_id=bank_id,
    content="DEVNOVATE test feedback: Users want a simpler dashboard with clearer charts."
)

print("Feedback stored successfully.")

# 2. Recall the memory
print("\n--- RECALL TEST ---")

result = client.recall(
    bank_id=bank_id,
    query="What do users want regarding the dashboard?"
)

print("Recall result:")
print(result)