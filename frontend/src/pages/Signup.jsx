import React, { useState } from "react";
import api from "../utils/api";
import { setToken } from "../utils/auth";

function Signup({ onLogin, setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/signup", {
        email,
        password,
      });

      setToken(res.data.access_token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
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
            Join thousands of learners who are achieving their goals with 
            AI-powered personalized education.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Start your personalized learning journey today</p>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
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
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            onClick={() => setShowSignup(false)}
            className="secondary-btn auth-switch"
          >
            Sign In
          </button>
        </div>

        <div className="auth-footer">
          <p>© 2026 EduMentor AI. Empowering learners worldwide.</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
