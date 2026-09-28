import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDashboardData } from "../services/dashboardApi";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();

      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard API error:", err);

      setError(
        "Unable to load dashboard data. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Loading real feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};

  const totalFeedback = summary.total_feedback || 0;
  const negativeFeedback = summary.negative_feedback || 0;
  const highPriorityFeedback = summary.high_priority_feedback || 0;

  const themeData =
    dashboardData?.top_themes?.map((item) => ({
      theme: item.theme || "Unknown",
      count: item.count || 0,
    })) || [];

  return (
    <div className="dashboard">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of user feedback and AI-generated insights
          </p>
        </div>
      </div>


      {/* KPI CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Feedback</span>

          <strong>
            {totalFeedback.toLocaleString()}
          </strong>

          <small>
            All collected feedback
          </small>
        </div>


        <div className="stat-card">
          <span>Negative Feedback</span>

          <strong>
            {negativeFeedback.toLocaleString()}
          </strong>

          <small>
            Feedback classified as negative
          </small>
        </div>


        <div className="stat-card">
          <span>High Priority</span>

          <strong>
            {highPriorityFeedback.toLocaleString()}
          </strong>

          <small>
            High or critical priority
          </small>
        </div>


        <div className="stat-card">
          <span>Top Themes</span>

          <strong>
            {themeData.length}
          </strong>

          <small>
            Most frequently mentioned themes
          </small>
        </div>

      </div>


      {/* CHARTS */}

      <div className="charts-grid">

        {/* TOP THEMES */}

        <div className="chart-card">

          <h2>Top Feedback Themes</h2>

          <p>
            Most frequently mentioned topics
          </p>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={themeData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="theme" />

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


        {/* HISTORICAL FEEDBACK FROM HINDSIGHT */}

        <div className="chart-card">

          <h2>Historical Feedback</h2>

          <p>
            Feedback recalled from Hindsight memory
          </p>

          <div className="historical-feedback">

            {dashboardData?.historical_feedback
              ?.slice(0, 5)
              .map((item, index) => (
                <div
                  className="feedback-item"
                  key={item.id || index}
                >
                  <p>{item.text}</p>
                </div>
              ))}

          </div>

        </div>

      </div>


      {/* AI INSIGHT */}

      <div className="ai-summary">

        <div>

          <h2>AI Insight</h2>

          <p>
            The dashboard is now connected to real feedback data.
            The AI agent can use Hindsight memory to compare current
            feedback with historical feedback and identify recurring
            patterns.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;