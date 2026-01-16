import React, { useState } from "react";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import MyPlans from "./pages/MyPlans";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import AIExplain from "./pages/AIExplain";
import Resources from "./pages/Resources";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isAuthenticated, removeToken } from "./utils/auth";

export default function App() {
  const [tab, setTab] = useState("home");
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setTab("home");
  };

  if (!loggedIn) {
    return showSignup ? (
      <Signup onLogin={handleLogin} setShowSignup={setShowSignup} />
    ) : (
      <Login onLogin={handleLogin} setShowSignup={setShowSignup} />
    );
  }

  return (
    <div className="app-root">
      {/* 🔝 Top Header */}
      <header className="top-header">
        <h1>EduMentor AI 🎓</h1>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <span>👋</span>
          Logout
        </button>
      </header>

      {/* 🧱 Main Layout */}
      <div className="app-layout">
        {/* 📌 Sidebar */}
        <aside className="sidebar">
          <button
            className={tab === "home" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("home")}
          >
            <span>🏠</span>
            Home
          </button>

          <button
            className={tab === "planner" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("planner")}
          >
            <span>📅</span>
            Create Plan
          </button>

          <button
            className={tab === "myplans" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("myplans")}
          >
            <span>📋</span>
            My Plans
          </button>

          <button
            className={tab === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("dashboard")}
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className={tab === "quiz" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("quiz")}
          >
            <span>🧠</span>
            Quiz
          </button>

          <button
              className={tab === "explain" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("explain")}
          >
            <span>🤖</span>
            AI Explain
          </button>
          
          <button
              className={tab === "resources" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("resources")}
          >
            <span>📚</span>
            Resources
          </button>
          
          <button
              className={tab === "notes" ? "nav-btn active" : "nav-btn"}
              onClick={() => setTab("notes")}
          >
            <span>📝</span>
            Notes
          </button>
        </aside>

        {/* 📄 Page Content */}
        <main className="content-area">
          {tab === "home" && <Home setTab={setTab} />}
          {tab === "planner" && <Planner setTab={setTab} />}
          {tab === "myplans" && <MyPlans setTab={setTab} />}
          {tab === "dashboard" && <Dashboard setTab={setTab} />}
          {tab === "quiz" && <Quiz />}
          {tab === "explain" && <AIExplain />}
          {tab === "resources" && <Resources />}
          {tab === "notes" && <Notes />}
        </main>
      </div>
    </div>
  );
}
