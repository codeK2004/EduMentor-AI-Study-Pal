import React, { useState } from "react";
import api from "../utils/api";

function ResetPassword({ resetToken, onResetSuccessful }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/reset-password", {
                token: resetToken,
                new_password: newPassword,
            });

            setMessage(res.data.message);

            // Give the user a moment to see the success message
            setTimeout(() => {
                onResetSuccessful();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reset password");
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
                </div>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2>Reset Password</h2>
                        <p>Please enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
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

                        {message && (
                            <div className="form-error" style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }}>
                                <span>✅</span>
                                {message}
                            </div>
                        )}

                        <button
                            className={`primary-btn auth-submit ${loading ? 'loading' : ''}`}
                            type="submit"
                            disabled={loading || message}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>Or remember your old password?</span>
                    </div>

                    <button
                        onClick={onResetSuccessful}
                        className="secondary-btn auth-switch"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
