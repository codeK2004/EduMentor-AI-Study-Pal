import React, { useEffect, useState } from "react";
import api from "../utils/api";

function Dashboard({ setTab }) {
  const [progress, setProgress] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Fetch progress and plans from backend
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      
      // Fetch progress
      const progressRes = await api.get("/progress/");
      setProgress(progressRes.data);
      
      // Fetch user's plans
      const plansRes = await api.get("/study/plans");
      setPlans(plansRes.data);
      
      console.log("✅ Dashboard data refreshed:", progressRes.data);
      
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchData(false);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // 🔹 Progress calculation
  const percent = progress && progress.total_days > 0
    ? Math.round((progress.completed_days / progress.total_days) * 100)
    : 0;

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📊</span>
          Learning Dashboard
        </h1>
        <p className="page-subtitle">
          Track your progress and monitor your learning journey
        </p>
        <button 
          className="secondary-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ marginTop: '1rem' }}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Progress'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{plans.length}</div>
            <div className="stat-label">Study Plans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{progress?.completed_days || 0}</div>
            <div className="stat-label">Days Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{progress?.total_days || 0}</div>
            <div className="stat-label">Total Days</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-number">{percent}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card">
        <div className="card-header">
          <h2>Current Progress</h2>
          <p>Your overall learning progress across all study plans</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="progress-details">
            <div className="progress-text">
              <strong>{progress?.completed_days || 0}</strong> of{" "}
              <strong>{progress?.total_days || 0}</strong> days completed
            </div>
            <div className="progress-percentage">
              {percent}% complete
            </div>
          </div>
        </div>

        {progress?.total_days === 0 && (
          <div className="no-progress">
            <div className="no-progress-icon">🎯</div>
            <h3>No Active Study Plan</h3>
            <p>Create your first study plan to start tracking your progress!</p>
            <button 
              className="primary-btn"
              onClick={() => setTab && setTab("planner")}
            >
              <span>🚀</span>
              Create Study Plan
            </button>
          </div>
        )}
      </div>

      {/* Recent Plans */}
      <div className="card">
        <div className="card-header">
          <h2>Your Study Plans</h2>
          <p>Recent study plans you've created</p>
        </div>

        {plans.length === 0 ? (
          <div className="empty-plans">
            <div className="empty-icon">📚</div>
            <h3>No Study Plans Yet</h3>
            <p>Create your first AI-powered study plan to get started!</p>
            <div className="empty-actions">
              <button 
                className="primary-btn"
                onClick={() => setTab && setTab("planner")}
              >
                <span>➕</span>
                Create Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="plans-preview">
            {plans.slice(0, 3).map((plan) => (
              <div key={plan.id} className="plan-preview-card">
                <div className="plan-preview-header">
                  <h4>{plan.subject}</h4>
                  <span className="plan-preview-duration">
                    {plan.deadline_days} days
                  </span>
                </div>
                <p className="plan-preview-date">
                  Created {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            
            {plans.length > 3 && (
              <div className="view-all-plans">
                <button 
                  className="secondary-btn"
                  onClick={() => setTab && setTab("myplans")}
                >
                  <span>📋</span>
                  View All Plans ({plans.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button 
            className="action-card"
            onClick={() => setTab && setTab("planner")}
          >
            <div className="action-icon">📅</div>
            <div className="action-title">Create Plan</div>
            <div className="action-desc">Generate a new study plan</div>
          </button>

          <button 
            className="action-card"
            onClick={() => setTab && setTab("quiz")}
          >
            <div className="action-icon">🧠</div>
            <div className="action-title">Take Quiz</div>
            <div className="action-desc">Test your knowledge</div>
          </button>

          <button 
            className="action-card"
            onClick={() => setTab && setTab("myplans")}
          >
            <div className="action-icon">📋</div>
            <div className="action-title">My Plans</div>
            <div className="action-desc">View all study plans</div>
          </button>

          <button 
            className="action-card"
            onClick={() => setTab && setTab("notes")}
          >
            <div className="action-icon">📝</div>
            <div className="action-title">Notes</div>
            <div className="action-desc">Manage your notes</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
