import React, { useState, useEffect } from "react";
import api from "../utils/api";
import PlanCard from "../components/PlanCard";

function Planner({ setTab }) {
  const [subject, setSubject] = useState("");
  const [weakAreas, setWeakAreas] = useState("");
  const [days, setDays] = useState("");
  const [plan, setPlan] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);

  // Fetch progress when component mounts or plan changes
  useEffect(() => {
    if (plan.length > 0 && currentPlanId) {
      fetchProgress();
    }
  }, [plan.length, currentPlanId]);

  const fetchProgress = async () => {
    try {
      if (currentPlanId) {
        const res = await api.get(`/progress/plan/${currentPlanId}`);
        setCompletedDays(res.data.completed_day_numbers || []);
      }
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  const generatePlan = async () => {
    setError("");
    setPlan([]);
    setSuccess(false);

    if (!subject || !weakAreas || !days) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 🔹 1. Generate study plan
      const res = await api.post("/study/plan", {
        subject: subject,
        weak_areas: weakAreas
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean),
        deadline_days: Number(days),
      });

      // 🔹 2. Validate response
      if (!res.data || !res.data.plan_data || !Array.isArray(res.data.plan_data.days)) {
        throw new Error("Invalid plan format from backend");
      }

      setPlan(res.data.plan_data.days);
      setCurrentPlanId(res.data.plan_id);
      setSuccess(true);

    } catch (err) {
      console.error("PLAN ERROR:", err);
      setError("Failed to generate study plan. Try again.");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setSubject("");
    setWeakAreas("");
    setDays("");
    setPlan([]);
    setCurrentPlanId(null);
    setSuccess(false);
    setError("");
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📅</span>
          Create Study Plan
        </h1>
        <p className="page-subtitle">
          Generate personalized AI-powered study plans tailored to your learning goals and timeline
        </p>
      </div>

      {/* Create Plan Form */}
      <div className="card">
        <div className="card-header">
          <h2>Plan Your Learning Journey</h2>
          <p>Tell us about your subject and areas you'd like to focus on</p>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📚</span>
              Subject
            </label>
            <input
              placeholder="e.g., Python Programming, Data Science, DevOps"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Study Duration
            </label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="form-input"
            >
              <option value="">Select duration</option>
              <option value="3">3 days - Quick Review</option>
              <option value="7">1 week - Standard</option>
              <option value="14">2 weeks - Comprehensive</option>
              <option value="21">3 weeks - In-depth</option>
              <option value="30">1 month - Mastery</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">💡</span>
            Areas to Focus On
          </label>
          <textarea
            placeholder="e.g., loops, functions, object-oriented programming, debugging (separate with commas)"
            value={weakAreas}
            onChange={(e) => setWeakAreas(e.target.value)}
            className="form-textarea"
            rows="3"
          />
          <div className="form-hint">
            💡 Tip: Be specific about topics you want to improve or learn
          </div>
        </div>

        <button
          className={`primary-btn generate-btn ${loading ? 'loading' : ''}`}
          onClick={generatePlan}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating your plan...
            </>
          ) : (
            <>
              <span>🚀</span>
              Generate Study Plan
            </>
          )}
        </button>

        {error && (
          <div className="form-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            <span>✅</span>
            Study plan created successfully! It's been saved to your account.
          </div>
        )}
      </div>

      {/* Render Plan */}
      {plan.length > 0 && (
        <div className="plan-section">
          <div className="plan-header">
            <h2>
              <span>🗓️</span>
              Your Personalized Study Plan
            </h2>
            <p>Follow this AI-generated plan to achieve your learning goals</p>
            <div className="plan-stats">
              <div className="plan-stat">
                <span className="stat-number">{plan.length}</span>
                <span className="stat-label">Days</span>
              </div>
              <div className="plan-stat">
                <span className="stat-number">{subject}</span>
                <span className="stat-label">Subject</span>
              </div>
              <div className="plan-stat">
                <span className="stat-number">{plan.reduce((acc, day) => acc + day.tasks.length, 0)}</span>
                <span className="stat-label">Tasks</span>
              </div>
            </div>
          </div>

          <div className="plan-grid">
            {plan.map((dayObj) => (
              <PlanCard
                key={dayObj.day}
                planId={currentPlanId}
                day={dayObj.day}
                topic={dayObj.topic}
                tasks={dayObj.tasks}
                completedDays={completedDays}
                onProgressUpdate={fetchProgress}
              />
            ))}
          </div>

          <div className="plan-actions">
            <button 
              className="success-btn"
              onClick={() => setTab && setTab("myplans")}
            >
              <span>📋</span>
              View All My Plans
            </button>
            <button 
              className="secondary-btn"
              onClick={resetForm}
            >
              <span>➕</span>
              Create Another Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner;
