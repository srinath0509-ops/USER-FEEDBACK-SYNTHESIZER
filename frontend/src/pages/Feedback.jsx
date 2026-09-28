import { useEffect, useState } from "react";
import { getFeedback } from "../services/feedbackApi";

function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("all");
  const [theme, setTheme] = useState("all");

  useEffect(() => {
    loadFeedback();
  }, [sentiment, theme]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFeedback({
        sentiment,
        theme,
      });

      setFeedbackData(data);
    } catch (err) {
      console.error("Feedback API error:", err);
      setError("Unable to load feedback data.");
    } finally {
      setLoading(false);
    }
  };

  // Search is handled on the already filtered results
  const filteredFeedback = feedbackData.filter((feedback) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      feedback.feedback_text
        ?.toLowerCase()
        .includes(searchText) ||
      feedback.product
        ?.toLowerCase()
        .includes(searchText) ||
      feedback.theme
        ?.toLowerCase()
        .includes(searchText) ||
      feedback.channel
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="feedback-page">
        <div className="dashboard-header">
          <h1>Feedback</h1>
          <p>Loading real feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-page">
        <div className="dashboard-header">
          <h1>Feedback</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">

      <div className="dashboard-header">
        <h1>Feedback</h1>
        <p>
          Explore and analyze individual user feedback.
        </p>
      </div>

      {/* FILTERS */}
      <div className="feedback-controls">

        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SENTIMENT FILTER */}
        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
        >
          <option value="all">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="neutral">Neutral</option>
        </select>

        {/* THEME FILTER */}
<select
  value={theme}
  onChange={(e) => setTheme(e.target.value)}
>
  <option value="all">All Themes</option>

  <option value="Other">Other</option>

  <option value="Customer Service">
    Customer Service
  </option>

  <option value="Delivery / Shipping">
    Delivery / Shipping
  </option>

  <option value="Technical / App Issues">
    Technical / App Issues
  </option>

  <option value="Pricing / Cost">
    Pricing / Cost
  </option>

  <option value="Product / Feature">
    Product / Feature
  </option>

  <option value="Payment / Billing">
    Payment / Billing
  </option>

  <option value="Quality / Reliability">
    Quality / Reliability
  </option>

  <option value="User Experience">
    User Experience
  </option>

  <option value="Refund / Returns">
    Refund / Returns
  </option>

  <option value="Account / Login">
    Account / Login
  </option>

  <option value="Availability / Stock">
    Availability / Stock
  </option>

  <option value="Fraud / Security">
    Fraud / Security
  </option>
</select>

      </div>

      {/* FEEDBACK LIST */}
      <div className="feedback-list">

        {filteredFeedback.length === 0 ? (
          <div className="feedback-card">
            <p className="feedback-text">
              No feedback found for the selected filters.
            </p>
          </div>
        ) : (
          filteredFeedback.map((feedback) => (

            <div
              className="feedback-card"
              key={feedback.feedback_id}
            >

              <div className="feedback-card-header">

                <span
                  className={`sentiment ${
                    feedback.sentiment?.toLowerCase() || ""
                  }`}
                >
                  {feedback.sentiment || "Unknown"}
                </span>

                <span className="feedback-date">
                  {feedback.timestamp
                    ? new Date(
                        feedback.timestamp
                      ).toLocaleDateString()
                    : "No date"}
                </span>

              </div>

              <p className="feedback-text">
                {feedback.feedback_text ||
                  "No feedback text"}
              </p>

              <div className="feedback-meta">

                <span>
                  Theme:{" "}
                  {feedback.theme || "Unknown"}
                </span>

                <span>
                  Channel:{" "}
                  {feedback.channel || "Unknown"}
                </span>

                <span>
                  Priority:{" "}
                  {feedback.issue_priority ||
                    "Unknown"}
                </span>

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Feedback;