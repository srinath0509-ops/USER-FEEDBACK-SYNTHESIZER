import { useEffect, useState } from "react";
import { getMemoryStats } from "../services/aiApi";

function LearningCurve() {
  const [stats, setStats] = useState(null);
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMemoryStats();

      setStats(result.stats || null);
      setBuckets(result.timeseries?.buckets || []);

    } catch (err) {
      console.error("Failed to load Hindsight memory data:", err);

      setError(
        err?.response?.data?.detail ||
        "Unable to load Hindsight memory data."
      );
    } finally {
      setLoading(false);
    }
  };

  let cumulative = 0;

  const curveData = buckets.map((bucket) => {
    const daily =
      (bucket.world || 0) +
      (bucket.experience || 0) +
      (bucket.observation || 0);

    cumulative += daily;

    return {
      ...bucket,
      daily,
      cumulative,
      date: new Date(bucket.time).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      ),
    };
  });

  const maxValue = Math.max(
    ...curveData.map((item) => item.cumulative),
    1
  );

  return (
    <div className="ai-insights-page">

      <div className="dashboard-header">
        <h1>Learning Curve</h1>

        <p>
          Hindsight memory growth over time.
        </p>
      </div>

      {loading && (
        <div className="insight-loading">
          🧠 Loading Hindsight memory data...
        </div>
      )}

      {error && (
        <div className="insight-error">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>

          {/* MEMORY SUMMARY */}

          <div className="memory-status">

            <div>
              <span className="memory-label">
                HINDSIGHT MEMORY
              </span>

              <h2>
                Long-term memory growth
              </h2>

              <p>
                This visualization shows the cumulative
                feedback memories retained by Hindsight.
              </p>
            </div>

            <span className="memory-badge">
              🧠 {stats.total_nodes} Memories
            </span>

          </div>


          {/* STATISTICS */}

          <div className="memory-flow">

            <h2>
              Hindsight Memory Statistics
            </h2>

            <div className="memory-steps">

              <div className="memory-step">
                <span>01</span>

                <h3>
                  {stats.total_nodes}
                </h3>

                <p>
                  Total Memories
                </p>
              </div>

              <div className="memory-step">
                <span>02</span>

                <h3>
                  {stats.nodes_by_fact_type?.world || 0}
                </h3>

                <p>
                  World Memories
                </p>
              </div>

              <div className="memory-step">
                <span>03</span>

                <h3>
                  {stats.nodes_by_fact_type?.observation || 0}
                </h3>

                <p>
                  Observations
                </p>
              </div>

              <div className="memory-step">
                <span>04</span>

                <h3>
                  {stats.total_links}
                </h3>

                <p>
                  Memory Links
                </p>
              </div>

            </div>

          </div>


          {/* LEARNING CURVE */}

          <div className="memory-flow">

            <h2>
              📈 Hindsight Learning Curve
            </h2>

            <p>
              Cumulative growth of long-term memory
              retained by Hindsight.
            </p>


            <div
              style={{
                position: "relative",
                height: "320px",
                marginTop: "30px",
                padding: "20px",
                background: "#f8f9ff",
                borderRadius: "16px",
                border: "1px solid #e5e7f2",
              }}
            >

              {/* Y AXIS */}

              <div
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "20px",
                  bottom: "45px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "#718096",
                  fontSize: "12px",
                }}
              >
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
              </div>


              {/* CHART */}

              <div
                style={{
                  position: "absolute",
                  left: "65px",
                  right: "20px",
                  top: "20px",
                  bottom: "45px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "12px",
                  borderLeft: "1px solid #d9ddeb",
                  borderBottom: "1px solid #d9ddeb",
                  paddingLeft: "15px",
                }}
              >

                {curveData.map((item, index) => {

                  const height =
                    item.cumulative === 0
                      ? 3
                      : Math.max(
                          (item.cumulative / maxValue) * 100,
                          8
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
                          fontSize: "12px",
                          marginBottom: "5px",
                          color: "#6246ea",
                        }}
                      >
                        {item.cumulative}
                      </strong>

                      <div
                        style={{
                          width: "65%",
                          height: `${height}%`,
                          minHeight: "3px",
                          borderRadius: "8px 8px 2px 2px",
                          background:
                            "linear-gradient(180deg, #6c4cff, #4c7dff)",
                          transition: "height 0.4s ease",
                        }}
                      />

                      <small
                        style={{
                          position: "absolute",
                          bottom: "-30px",
                          fontSize: "11px",
                          color: "#718096",
                        }}
                      >
                        {item.date}
                      </small>

                    </div>
                  );
                })}

              </div>

            </div>


            <div
              style={{
                marginTop: "25px",
                padding: "15px 18px",
                background: "#f4f1ff",
                borderRadius: "12px",
                color: "#52627a",
                fontSize: "14px",
              }}
            >
              <strong>How to read this:</strong>{" "}
              the curve represents cumulative memories retained
              by Hindsight. As feedback is retained, the
              long-term memory available for future recall grows.
            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default LearningCurve;