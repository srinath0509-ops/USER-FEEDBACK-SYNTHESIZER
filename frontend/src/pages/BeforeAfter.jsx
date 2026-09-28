import { useState } from "react";
import { getBeforeAfter } from "../services/aiApi";

function renderStructuredAnswer(answer) {
  if (!answer) {
    return <p>No response returned.</p>;
  }

  const sections = [
    "Sentiment",
    "Main Theme",
    "Recurring Issue",
    "Change/Trend",
    "Actionable Recommendation",
    "Summary",
  ];

  return sections.map((section, index) => {
    const remainingSections = sections.slice(index + 1);

    const pattern = new RegExp(
      `\\*\\*${section}:\\*\\*\\s*([\\s\\S]*?)(?=\\s*\\*\\*(?:${remainingSections.join(
        "|"
      )}):\\*\\*|$)`,
      "i"
    );

    const match = answer.match(pattern);

    if (!match || !match[1].trim()) {
      return null;
    }

    return (
      <div className="comparison-section" key={section}>
        <h4>{section}</h4>

        <p>{match[1].trim()}</p>
      </div>
    );
  });
}

function BeforeAfter() {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runComparison = async () => {
    try {
      setLoading(true);
      setError("");
      setComparison(null);

      const result = await getBeforeAfter(
        "The dashboard is difficult to understand and the charts are confusing."
      );

      setComparison(result);
    } catch (err) {
      console.error("Before/After comparison failed:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to generate the comparison."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Before & After</h1>

        <p>
          See how Hindsight memory changes the AI's
          understanding of user feedback.
        </p>
      </div>


      {/* INTRODUCTION */}

      <div className="memory-status">

        <div>
          <span className="memory-label">
            HINDSIGHT DEMONSTRATION
          </span>

          <h2>
            Without Memory vs With Memory
          </h2>

          <p>
            The same feedback is analyzed twice:
            once without historical context and once
            after recalling relevant Hindsight memories.
          </p>
        </div>

      </div>


      {/* FLOW */}

      <div className="memory-flow">

        <h2>
          🔄 How Hindsight Changes the Analysis
        </h2>

        <div className="memory-steps">

          <div className="memory-step">
            <span>01</span>

            <h3>
              Current Feedback
            </h3>

            <p>
              Dashboard is difficult to understand
              and charts are confusing.
            </p>
          </div>


          <div className="memory-step">
            <span>02</span>

            <h3>
              Without Memory
            </h3>

            <p>
              AI analyzes only the current feedback.
            </p>
          </div>


          <div className="memory-step">
            <span>03</span>

            <h3>
              Hindsight RECALL
            </h3>

            <p>
              Relevant historical feedback is retrieved.
            </p>
          </div>


          <div className="memory-step">
            <span>04</span>

            <h3>
              Context-Aware Insight
            </h3>

            <p>
              AI identifies recurring patterns and trends.
            </p>
          </div>

        </div>

      </div>


      {/* RUN COMPARISON */}

      <div className="memory-flow">

        <h2>
          🧪 Run Live Comparison
        </h2>

        <p>
          This uses the real AI + Hindsight backend.
        </p>

        <button
          onClick={runComparison}
          disabled={loading}
          style={{
            padding: "13px 22px",
            marginTop: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#6246ea",
            color: "white",
            fontWeight: "700",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading
            ? "Running comparison..."
            : "Run Hindsight Comparison"}
        </button>


        {error && (
          <div
            className="insight-error"
            style={{
              marginTop: "20px",
            }}
          >
            {error}
          </div>
        )}

      </div>


      {/* RESULTS */}

      {comparison && (

        <div className="comparison-grid">

          {/* WITHOUT HINDSIGHT */}

          <div className="comparison-card">

            <span>
              WITHOUT HINDSIGHT
            </span>

            <h3>
              No Historical Memory
            </h3>

            <div className="structured-answer">
              {renderStructuredAnswer(
                comparison.before.answer
              )}
            </div>

            <small>
              Memories used:{" "}
              {comparison.before.memories_used}
            </small>

          </div>


          {/* WITH HINDSIGHT */}

          <div className="comparison-card">

            <span>
              WITH HINDSIGHT
            </span>

            <h3>
              Historical Context Recalled
            </h3>

            <div className="structured-answer">
              {renderStructuredAnswer(
                comparison.after.answer
              )}
            </div>

            <small>
              Memories used:{" "}
              {comparison.after.memories_used}
            </small>

          </div>

        </div>

      )}

    </div>
  );
}

export default BeforeAfter;