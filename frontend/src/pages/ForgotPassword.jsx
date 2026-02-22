import React, { useState } from "react";
import api from "../utils/api";

function ForgotPassword({ onBackToLogin, onTokenReceived }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.reset_token) {
        setResetToken(res.data.reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to process request");
    }

    setLoading(false);
  };

  const handleSimulateEmailClick = () => {
    onTokenReceived(resetToken);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🎓</span>
            <h1 className="logo-text">EduMentor AI</h1>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {!message ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="auth-success-message" style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ color: "green", marginBottom: "15px" }}>{message}</p>
              
              {/* This is specifically for our local demo without an email service */}
              {resetToken && (
                <div className="demo-email-simulation" style={{ padding: "15px", border: "1px dashed #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
                  <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                    <i>[Demo Simulation] Since there is no email service, click below to simulate following the emailed link:</i>
                  </p>
                  <button 
                    onClick={handleSimulateEmailClick}
                    className="primary-btn"
                    style={{ background: "#4caf50", borderColor: "#4caf50" }}
                  >
                    Simulate Clicking Email Link
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="auth-divider">
            <span>Remembered your password?</span>
          </div>

          <button
            onClick={onBackToLogin}
            className="secondary-btn auth-switch"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
