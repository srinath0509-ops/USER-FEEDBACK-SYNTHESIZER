import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { getAnalyticsSummary } from "../services/analyticsApi";

const COLORS = ["#22c55e", "#ef4444", "#94a3b8"];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnalyticsSummary();

      setAnalytics(data);
    } catch (err) {
      console.error("Analytics API error:", err);
      setError("Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="dashboard-header">
          <h1>Analytics</h1>
          <p>Loading real analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="dashboard-header">
          <h1>Analytics</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalFeedback = analytics?.total_feedback || 0;

  const positive = analytics?.sentiment?.positive || 0;
  const negative = analytics?.sentiment?.negative || 0;
  const neutral = analytics?.sentiment?.neutral || 0;

  const topThemes = analytics?.top_themes || [];

  const topTheme =
    topThemes.length > 0 ? topThemes[0].theme : "No data";

  const positivePercentage =
    totalFeedback > 0
      ? ((positive / totalFeedback) * 100).toFixed(1)
      : "0.0";

  const negativePercentage =
    totalFeedback > 0
      ? ((negative / totalFeedback) * 100).toFixed(1)
      : "0.0";

  const sentimentData = [
    {
      name: "Positive",
      value: positive,
    },
    {
      name: "Negative",
      value: negative,
    },
    {
      name: "Neutral",
      value: neutral,
    },
  ];

  return (
    <div className="analytics-page">

      <div className="dashboard-header">
        <h1>Analytics</h1>
        <p>
          Understand sentiment, trends and recurring feedback themes.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Feedback</span>
          <strong>
            {totalFeedback.toLocaleString()}
          </strong>
          <small>Across all channels</small>
        </div>

        <div className="stat-card">
          <span>Top Theme</span>
          <strong>{topTheme}</strong>
          <small>Most mentioned theme</small>
        </div>

        <div className="stat-card">
          <span>Positive</span>
          <strong>{positivePercentage}%</strong>
          <small>Overall sentiment</small>
        </div>

        <div className="stat-card">
          <span>Negative</span>
          <strong>{negativePercentage}%</strong>
          <small>Overall sentiment</small>
        </div>

      </div>

      {/* TOP FEEDBACK THEMES */}
      <div className="analytics-card">

        <h2>Top Feedback Themes</h2>

        <p>
          Most frequently mentioned topics in the feedback dataset.
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topThemes}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="theme"
              angle={-20}
              textAnchor="end"
              height={70}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#7c3aed"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* SENTIMENT */}
      <div className="analytics-card">

        <h2>Sentiment Distribution</h2>

        <p>
          Distribution of positive, negative and neutral feedback.
        </p>

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={sentimentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {sentimentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* PRIORITY */}
      <div className="analytics-card">

        <h2>Issue Priority</h2>

        <p>
          Distribution of feedback based on issue priority.
        </p>

        <div className="issue-list">

          {Object.entries(
            analytics?.issue_priority || {}
          ).map(([priority, count]) => (

            <div
              className="issue-item"
              key={priority}
            >

              <div>
                <strong>
                  {priority || "Unknown"}
                </strong>

                <p>
                  {count.toLocaleString()} feedback records
                </p>
              </div>

              <span className="issue-badge">
                {(
                  (count / totalFeedback) *
                  100
                ).toFixed(1)}
                %
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Analytics;