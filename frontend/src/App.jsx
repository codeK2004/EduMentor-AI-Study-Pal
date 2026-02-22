import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import MyPlans from "./pages/MyPlans";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import AIExplain from "./pages/AIExplain";
import Resources from "./pages/Resources";
import Notes from "./pages/Notes";
import SavedContent from "./pages/SavedContent";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { isAuthenticated, removeToken } from "./utils/auth";

export default function App() {
  const [tab, setTab] = useState("home");
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  // Check authentication status on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (!authenticated && loggedIn) {
        // User was logged out (token expired or removed)
        setLoggedIn(false);
        setTab("home");
      }
    };

    // Check immediately
    checkAuth();

    // Set up listener for storage changes (in case token is removed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check every 30 seconds
    const interval = setInterval(checkAuth, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loggedIn]);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setTab("home");
  };

  if (!loggedIn) {
    if (resetToken) {
      return (
        <ResetPassword
          resetToken={resetToken}
          onResetSuccessful={() => {
            setResetToken(null);
            setShowForgotPassword(false);
            setShowSignup(false);
          }}
        />
      );
    }

    if (showForgotPassword) {
      return (
        <ForgotPassword
          onBackToLogin={() => setShowForgotPassword(false)}
          onTokenReceived={(token) => setResetToken(token)}
        />
      );
    }

    return showSignup ? (
      <Signup onLogin={handleLogin} setShowSignup={setShowSignup} />
    ) : (
      <Login
        onLogin={handleLogin}
        setShowSignup={setShowSignup}
        setShowForgotPassword={setShowForgotPassword}
      />
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

          <button
            className={tab === "saved" ? "nav-btn active" : "nav-btn"}
            onClick={() => setTab("saved")}
          >
            <span>💾</span>
            Saved
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
          {tab === "saved" && <SavedContent />}
        </main>
      </div>
    </div>
  );
}
