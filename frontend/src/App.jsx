import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import AIChat from "./pages/AIChat";
import LearningCurve from "./pages/LearningCurve";
import BeforeAfter from "./pages/BeforeAfter";


import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Sidebar />

        <div className="main-section">

          <Navbar />

          <main className="page-content">

            <Routes>

              <Route
                path="/"
                element={
                  <Navigate
                    to="/dashboard"
                    replace
                  />
                }
              />

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/feedback"
                element={<Feedback />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/ai-insights"
                element={<AIInsights />}
              />

              <Route
                path="/learning-curve"
                element={<LearningCurve />}
              />

              <Route
                path="/before-after"
                element={<BeforeAfter />}
              />

              <Route
                path="/ai-chat"
                element={<AIChat />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;