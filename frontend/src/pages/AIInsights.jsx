import { useEffect, useState } from "react";

import {
  getAIInsights,
  getMemoryStats,
  getBeforeAfter,
} from "../services/aiApi";


function parseInsights(answer) {
  if (!answer) return [];

  const sections = [
    "Sentiment",
    "Main Theme",
    "Recurring Issue",
    "Change/Trend",
    "Actionable Recommendation",
    "Summary",
  ];

  const insights = [];

  sections.forEach((section, index) => {
    const currentPattern = new RegExp(
      `${section}:\\s*([\\s\\S]*?)(?=\\n(?:${sections
        .filter((_, i) => i > index)
        .join("|")}):|$)`,
      "i"
    );

    const match = answer.match(currentPattern);

    if (match && match[1].trim()) {
      let type = "AI Insight";

      if (section === "Sentiment") type = "Sentiment";
      else if (section === "Main Theme") type = "Main Theme";
      else if (section === "Recurring Issue") type = "Recurring Pattern";
      else if (section === "Change/Trend") type = "Trend";
      else if (section === "Actionable Recommendation")
        type = "Recommendation";
      else if (section === "Summary") type = "Summary";

      insights.push({
        title: section,
        description: match[1].trim(),
        type,
        confidence: "AI Generated",
      });
    }
  });

  return insights;
}


function AIInsights() {

  const [insights, setInsights] = useState([]);
  const [memories, setMemories] = useState([]);

  const [memoryStats, setMemoryStats] = useState(null);
  const [memoryTimeseries, setMemoryTimeseries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");


  useEffect(() => {
    loadInsights();
    loadMemoryStats();
  }, []);


  const loadInsights = async () => {

    try {

      setLoading(true);
      setError("");

      const result = await getAIInsights();

      setInsights(parseInsights(result.answer));
      setMemories(result.memories_used || []);

    } catch (err) {

      console.error("Failed to load AI insights:", err);

      const backendError = err?.response?.data?.detail;

      if (
        backendError?.includes("quota") ||
        backendError?.includes("rate limit")
      ) {

        setError(
          "AI generation is temporarily unavailable because the LLM rate limit was reached."
        );

      } else {

        setError(
          backendError ||
          "Unable to load AI insights. Please make sure the backend is running."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  const loadMemoryStats = async () => {

    try {

      const result = await getMemoryStats();

      setMemoryStats(result.stats || null);
      setMemoryTimeseries(
        result.timeseries?.buckets || []
      );

    } catch (err) {

      console.error(
        "Failed to load Hindsight statistics:",
        err
      );

    }
  };


  const runBeforeAfter = async () => {

    try {

      setComparisonLoading(true);
      setComparisonError("");

      const result = await getBeforeAfter(
        "The dashboard is difficult to understand and the charts are confusing."
      );

      setComparison(result);

    } catch (err) {

      console.error(
        "Before/After comparison failed:",
        err
      );

      setComparisonError(
        err?.response?.data?.detail ||
        "Unable to generate the Hindsight comparison."
      );

    } finally {

      setComparisonLoading(false);

    }
  };


  return (

    <div className="ai-insights-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <h1>AI Insights</h1>

        <p>
          AI-generated patterns and insights from user feedback.
        </p>

      </div>


      {/* MEMORY STATUS */}

      <div className="memory-status">

        <div>

          <span className="memory-label">
            AI Memory
          </span>

          <h2>
            Learning from historical feedback
          </h2>

          <p>
            Hindsight allows the AI agent to retain useful
            feedback context and recall relevant information
            from previous interactions.
          </p>

        </div>

        <span className="memory-badge">

          🧠 {memories.length} Memories Recalled

        </span>

      </div>


      {/* ERROR */}

      {error && (

        <div className="insight-error">
          {error}
        </div>

      )}


      {/* AI INSIGHTS */}

      {loading && !error && (

        <div className="insight-loading">

          🧠 Recalling historical feedback
          and generating AI insights...

        </div>

      )}


      {!loading && !error && (

        <div className="insights-grid">

          {insights.map((insight, index) => (

            <div
              className="insight-card"
              key={index}
            >

              <div className="insight-top">

                <span className="insight-type">
                  {insight.type}
                </span>

                <span className="confidence">
                  {insight.confidence}
                </span>

              </div>

              <h2>
                {insight.title}
              </h2>

              <p>
                {insight.description}
              </p>

            </div>

          ))}

        </div>

      )}


      {/* HINDSIGHT STATISTICS */}

      {memoryStats && (

        <div className="memory-flow">

          <h2>
            🧠 Hindsight Memory
          </h2>

          <p>
            Live statistics from the
            <strong> devnovate-feedback </strong>
            memory bank.
          </p>


          <div className="memory-steps">

            <div className="memory-step">

              <span>01</span>

              <h3>
                {memoryStats.total_nodes}
              </h3>

              <p>
                Total Memories
              </p>

            </div>


            <div className="memory-step">

              <span>02</span>

              <h3>
                {memoryStats.nodes_by_fact_type?.world || 0}
              </h3>

              <p>
                World Memories
              </p>

            </div>


            <div className="memory-step">

              <span>03</span>

              <h3>
                {memoryStats.nodes_by_fact_type?.observation || 0}
              </h3>

              <p>
                Observations
              </p>

            </div>


            <div className="memory-step">

              <span>04</span>

              <h3>
                {memoryStats.total_links}
              </h3>

              <p>
                Memory Links
              </p>

            </div>

          </div>

        </div>

      )}


      {/* MEMORY ACTIVITY */}

      {memoryTimeseries.length > 0 && (

        <div className="memory-flow">

        <h2>
          📈 Hindsight Learning Curve
        </h2>

        <p>
          Cumulative growth of long-term memory retained by Hindsight
          over the last 7 days.
        </p>


          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "18px",
              height: "220px",
              padding: "20px 10px",
              borderRadius: "14px",
              background: "#f8f9ff",
              marginTop: "20px",
            }}
          >

            {memoryTimeseries.map(
              (bucket, index) => {

            const total =
              bucket.world +
              bucket.experience +
              bucket.observation;

            const cumulative = memoryTimeseries
              .slice(0, index + 1)
              .reduce(
                (sum, item) =>
                  sum +
                  item.world +
                  item.experience +
                  item.observation,
                0
              );

            const height =
              cumulative > 0
                ? Math.max(cumulative * 10, 25)
                : 5;

                const date =
                  new Date(
                    bucket.time
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                    }
                  );

                return (

                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >

                    <strong
                      style={{
                        marginBottom: "6px",
                      }}
                    >
                      {cumulative}
                    </strong>

                    <div
                      style={{
                        width: "55%",
                        height: `${height}px`,
                        minHeight:
                          total > 0
                            ? "25px"
                            : "5px",
                        borderRadius:
                          "8px 8px 2px 2px",
                        background:
                          "linear-gradient(180deg, #6c4cff, #4c7dff)",
                      }}
                    />

                    <small
                      style={{
                        marginTop: "8px",
                      }}
                    >
                      {date}
                    </small>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}


      {/* HISTORICAL MEMORY RECALL */}

      {!loading &&
        memories.length > 0 && (

          <div className="memory-flow">

            <h2>
              🧠 Historical Feedback Recalled
            </h2>

            <p>
              The AI used historical feedback from
              Hindsight to generate these insights.
            </p>


            <div className="memory-steps">

              {memories
                .slice(0, 4)
                .map((memory, index) => (

                  <div
                    className="memory-step"
                    key={index}
                  >

                    <span>
                      {String(index + 1)
                        .padStart(2, "0")}
                    </span>

                    <h3>
                      {memory.type}
                    </h3>

                    <p>
                      {memory.text}
                    </p>

                  </div>

                ))}

            </div>

          </div>

        )}


      {/* BEFORE / AFTER */}

      <div className="memory-flow">

        <h2>
          🔄 Hindsight Impact
        </h2>

        <p>
          Compare the AI response with and without
          historical Hindsight memory.
        </p>


        <button
          onClick={runBeforeAfter}
          disabled={comparisonLoading}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            background: "#6246ea",
            color: "white",
            fontWeight: "600",
            cursor: comparisonLoading
              ? "wait"
              : "pointer",
            marginTop: "10px",
          }}
        >

          {comparisonLoading
            ? "Running comparison..."
            : "Run Hindsight Comparison"}

        </button>


        {comparisonError && (

          <div
            className="insight-error"
            style={{
              marginTop: "15px",
            }}
          >
            {comparisonError}
          </div>

        )}


        {comparison && (

          <div
            className="comparison-grid"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="comparison-card">

              <span>
                WITHOUT HINDSIGHT
              </span>

              <h3>
                No Historical Memory
              </h3>

              <div className="structured-answer">
                {renderStructuredAnswer(comparison.before.answer)}
              </div>

              <small>
                Memories used:{" "}
                {comparison.before.memories_used}
              </small>

            </div>


            <div className="comparison-card">

              <span>
                WITH HINDSIGHT
              </span>

              <h3>
                Historical Context Recalled
              </h3>

              <div className="structured-answer">
                {renderStructuredAnswer(comparison.after.answer)}
              </div>

              <small>
                Memories used:{" "}
                {comparison.after.memories_used}
              </small>

            </div>

          </div>

        )}

      </div>


      {/* HOW AI LEARNS */}

      <div className="memory-flow">

        <h2>
          How the AI Learns
        </h2>


        <div className="memory-steps">

          <div className="memory-step">

            <span>01</span>

            <h3>
              Feedback arrives
            </h3>

            <p>
              New user feedback is analyzed by
              the AI.
            </p>

          </div>


          <div className="memory-step">

            <span>02</span>

            <h3>
              RETAIN
            </h3>

            <p>
              Useful information is stored as
              long-term memory.
            </p>

          </div>


          <div className="memory-step">

            <span>03</span>

            <h3>
              RECALL
            </h3>

            <p>
              Relevant historical context is
              retrieved when needed.
            </p>

          </div>


          <div className="memory-step">

            <span>04</span>

            <h3>
              Better Insight
            </h3>

            <p>
              The AI combines current and historical
              feedback to identify patterns.
            </p>

          </div>

        </div>

      </div>


    </div>

  );
}


export default AIInsights;
function renderStructuredAnswer(answer) {
  const sections = [
    "Sentiment",
    "Main Theme",
    "Recurring Issue",
    "Change/Trend",
    "Actionable Recommendation",
    "Summary",
  ];

  return sections.map((section, index) => {
    const nextSections = sections.slice(index + 1);

    const pattern = new RegExp(
      `\\*\\*${section}:\\*\\*\\s*([\\s\\S]*?)(?=\\s*\\*\\*(?:${nextSections.join("|")}):\\*\\*|$)`,
      "i"
    );

    const match = answer?.match(pattern);

    if (!match || !match[1].trim()) return null;

    return (
      <div className="comparison-section" key={section}>
        <h4>{section}</h4>
        <p>{match[1].trim()}</p>
      </div>
    );
  });
}