import React, { useState } from "react";
import api from "../utils/api";
import { setToken } from "../utils/auth";

function Login({ onLogin, setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setToken(res.data.access_token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🎓</span>
            <h1 className="logo-text">EduMentor AI</h1>
          </div>
          <p className="auth-subtitle">Let's Plan and Study Together</p>
          <p className="auth-description">
            Your AI-powered learning companion for personalized study plans, 
            interactive quizzes, and intelligent explanations.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            {error && (
              <div className="form-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <button 
              className={`primary-btn auth-submit ${loading ? 'loading' : ''}`} 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            onClick={() => setShowSignup(true)}
            className="secondary-btn auth-switch"
          >
            Create Account
          </button>
        </div>

        <div className="auth-footer">
          <p>© 2026 EduMentor AI. Empowering learners worldwide.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
