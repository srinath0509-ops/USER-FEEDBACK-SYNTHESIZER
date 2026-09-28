import pandas as pd
from hindsight_service import store_feedback
CSV_PATH = "../data/final_feedback_dataset.csv"
df = pd.read_csv(CSV_PATH).head(500)
for i, row in df.iterrows():
    text = (
        f"Feedback ID: {row['feedback_id']}. "
        f"Product: {row['product']}. "
        f"Channel: {row['channel']}. "
        f"Date: {row['timestamp']}. "
        f"Sentiment: {row['sentiment']}. "
        f"Theme: {row['theme']}. "
        f"Issue priority: {row['issue_priority']}. "
        f"Feedback: {row['feedback_text']}"
    )
    try:
        store_feedback(text)
        print(f"Imported {i + 1}/500")
    except Exception as e:
        print(f"Failed {row['feedback_id']}: {e}")
print("Hindsight import completed.")
