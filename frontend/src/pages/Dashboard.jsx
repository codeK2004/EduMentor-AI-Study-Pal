import React, { useEffect, useState } from "react";
import api from "../utils/api";

function Dashboard({ setTab }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Fetch plans with individual progress from backend
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      
      // Fetch user's plans (which now include individual progress)
      const plansRes = await api.get("/study/plans");
      setPlans(plansRes.data);
      
      console.log("✅ Dashboard data refreshed:", plansRes.data);
      
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
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Force refresh by adding timestamp to prevent caching
      const timestamp = Date.now();
      
      // Fetch user's plans with cache-busting
      const plansRes = await api.get(`/study/plans?t=${timestamp}`);
      setPlans(plansRes.data);
      
      console.log("✅ Dashboard manually refreshed:", plansRes.data);
      
    } catch (err) {
      console.error("Failed to refresh dashboard data", err);
    } finally {
      setRefreshing(false);
    }
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

  // 🔹 Calculate overall stats from ACTIVE plans only (exclude completed plans)
  const activePlans = plans.filter(plan => {
    const planPercent = plan.total_days > 0 ? (plan.completed_days / plan.total_days) * 100 : 0;
    return planPercent < 100; // Only count plans that are not 100% complete
  });
  
  const completedPlans = plans.filter(plan => {
    const planPercent = plan.total_days > 0 ? (plan.completed_days / plan.total_days) * 100 : 0;
    return planPercent >= 100; // Count completed plans separately
  });
  
  const totalPlans = plans.length;
  const activePlansCount = activePlans.length;
  const completedPlansCount = completedPlans.length;
  
  // Calculate overall progress from ACTIVE plans only
  const totalDaysAcrossActivePlans = activePlans.reduce((sum, plan) => sum + (plan.total_days || 0), 0);
  const totalCompletedDaysAcrossActivePlans = activePlans.reduce((sum, plan) => sum + (plan.completed_days || 0), 0);
  
  // Overall progress is 0 if no active plans, otherwise calculate from active plans only
  const overallPercent = totalDaysAcrossActivePlans > 0 
    ? Math.round((totalCompletedDaysAcrossActivePlans / totalDaysAcrossActivePlans) * 100)
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
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">{activePlansCount}</div>
            <div className="stat-label">Active Plans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{completedPlansCount}</div>
            <div className="stat-label">Completed Plans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-number">{totalCompletedDaysAcrossActivePlans}</div>
            <div className="stat-label">Days Completed</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              (Active plans only)
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-number">{overallPercent}%</div>
            <div className="stat-label">Overall Progress</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              {activePlansCount === 0 ? '(No active plans)' : '(Active plans only)'}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Plans Progress */}
      <div className="card">
        <div className="card-header">
          <h2>Individual Plan Progress</h2>
          <p>Track progress for each of your study plans separately</p>
        </div>

        {plans.length === 0 ? (
          <div className="no-progress">
            <div className="no-progress-icon">🎯</div>
            <h3>No Study Plans</h3>
            <p>Create your first study plan to start tracking your progress!</p>
            <button 
              className="primary-btn"
              onClick={() => setTab && setTab("planner")}
            >
              <span>🚀</span>
              Create Study Plan
            </button>
          </div>
        ) : (
          <div className="individual-plans-progress">
            {plans.map((plan) => {
              const planPercent = plan.total_days > 0 
                ? Math.round((plan.completed_days / plan.total_days) * 100)
                : 0;
              
              return (
                <div key={plan.id} className="plan-progress-card">
                  <div className="plan-progress-header">
                    <div className="plan-info">
                      <h4>{plan.subject}</h4>
                      <span className="plan-duration">{plan.deadline_days} days plan</span>
                      {plan.is_completed && (
                        <span className="completion-badge">✅ Completed</span>
                      )}
                    </div>
                    <div className="plan-stats">
                      <span className="progress-text">
                        {plan.completed_days || 0} / {plan.total_days || 0} days
                      </span>
                      <span className="progress-percent">{planPercent}%</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${planPercent}%` }}
                    />
                  </div>
                  
                  <div className="plan-actions">
                    <button 
                      className="secondary-btn"
                      onClick={() => setTab && setTab("myplans")}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
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
