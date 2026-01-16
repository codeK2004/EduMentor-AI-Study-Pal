import React, { useState, useEffect } from "react";
import api from "../utils/api";
import PlanCard from "../components/PlanCard";

function MyPlans({ setTab }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [completedDays, setCompletedDays] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchProgress();
  }, [refreshKey]);

  const fetchProgress = async () => {
    try {
      const res = await api.get("/progress/");
      setCompletedDays(res.data.completed_day_numbers || []);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/study/plans");
      setPlans(res.data);
      
      // If a plan is selected, refresh its details
      if (selectedPlan) {
        await viewPlanDetails(selectedPlan.id);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError("Failed to load your study plans");
    } finally {
      setLoading(false);
    }
  };

  const viewPlanDetails = async (planId) => {
    try {
      const res = await api.get(`/study/plans/${planId}`);
      setSelectedPlan(res.data);
    } catch (err) {
      console.error("Failed to fetch plan details:", err);
      setError("Failed to load plan details");
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this study plan?")) {
      return;
    }

    try {
      await api.delete(`/study/plans/${planId}`);
      setPlans(plans.filter(plan => plan.id !== planId));
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan(null);
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
      setError("Failed to delete plan");
    }
  };

  const regeneratePlan = async (planId) => {
    try {
      const res = await api.put(`/study/plans/${planId}/regenerate`);
      // Update the selected plan with new data
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({
          ...selectedPlan,
          plan_data: res.data
        });
      }
    } catch (err) {
      console.error("Failed to regenerate plan:", err);
      setError("Failed to regenerate plan");
    }
  };

  const handleProgressUpdate = () => {
    // Refresh plans and selected plan details
    setRefreshKey(prev => prev + 1);
  };

  if (loading && plans.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your study plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📋</span>
          My Study Plans
        </h1>
        <p className="page-subtitle">
          View, manage, and continue your personalized learning journeys
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2>No Study Plans Yet</h2>
          <p>Create your first AI-powered study plan to get started on your learning journey.</p>
          <button 
            className="primary-btn"
            onClick={() => setTab("planner")}
          >
            <span>🚀</span>
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="plans-layout">
          {/* Plans List */}
          <div className="plans-sidebar">
            <div className="plans-header">
              <h3>Your Plans ({plans.length})</h3>
              <button 
                className="secondary-btn"
                onClick={() => setTab("planner")}
              >
                <span>➕</span>
                New Plan
              </button>
            </div>

            <div className="plans-list">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`plan-item ${selectedPlan?.id === plan.id ? 'active' : ''}`}
                  onClick={() => viewPlanDetails(plan.id)}
                >
                  <div className="plan-item-header">
                    <h4>{plan.subject}</h4>
                    <span className="plan-duration">{plan.deadline_days} days</span>
                  </div>
                  <p className="plan-date">
                    Created {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                  <div className="plan-actions">
                    <button 
                      className="action-btn regenerate"
                      onClick={(e) => {
                        e.stopPropagation();
                        regeneratePlan(plan.id);
                      }}
                      title="Regenerate Plan"
                    >
                      🔄
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id);
                      }}
                      title="Delete Plan"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Details */}
          <div className="plan-details">
            {selectedPlan ? (
              <div>
                <div className="plan-details-header">
                  <h2>
                    <span>🎯</span>
                    {selectedPlan.subject}
                  </h2>
                  
                  {selectedPlan.is_completed && (
                    <div className="completion-badge-large">
                      <span>✅</span>
                      Plan Completed!
                    </div>
                  )}
                  
                  <div className="plan-meta">
                    <span className="meta-item">
                      <strong>Duration:</strong> {selectedPlan.deadline_days} days
                    </span>
                    <span className="meta-item">
                      <strong>Focus Areas:</strong> {selectedPlan.weak_areas}
                    </span>
                    <span className="meta-item">
                      <strong>Progress:</strong> {selectedPlan.completed_days || 0} of {selectedPlan.total_days || 0} days completed
                    </span>
                    <span className="meta-item">
                      <strong>Created:</strong> {new Date(selectedPlan.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="plan-content">
                  <h3>Study Schedule</h3>
                  <div className="plan-grid">
                    {selectedPlan.plan_data.days.map((dayObj) => (
                      <PlanCard
                        key={dayObj.day}
                        day={dayObj.day}
                        topic={dayObj.topic}
                        tasks={dayObj.tasks}
                        completedDays={completedDays}
                        onProgressUpdate={handleProgressUpdate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="select-plan-message">
                <div className="select-icon">👈</div>
                <h3>Select a Plan</h3>
                <p>Choose a study plan from the list to view its details and continue your learning journey.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlans;