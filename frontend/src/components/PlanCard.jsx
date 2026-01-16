import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";

export default function PlanCard({ day, topic, tasks, onProgressUpdate, completedDays = [] }) {
  const [completed, setCompleted] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [updating, setUpdating] = useState(false);

  // Check if this day is already completed from backend
  useEffect(() => {
    if (completedDays && completedDays.includes(day)) {
      setCompleted(true);
      // Mark all tasks as completed
      setCompletedTasks(new Set(tasks.map((_, index) => index)));
    }
  }, [completedDays, day, tasks]);

  const toggleTask = async (taskIndex) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskIndex)) {
      newCompleted.delete(taskIndex);
    } else {
      newCompleted.add(taskIndex);
    }
    setCompletedTasks(newCompleted);
    
    // Mark day as completed if all tasks are done
    const allTasksCompleted = newCompleted.size === tasks.length;
    
    if (allTasksCompleted && !completed && !updating) {
      setCompleted(true);
      setUpdating(true);
      
      // Update progress in backend with specific day number
      try {
        const response = await api.post("/progress/complete-day", {
          day_number: day
        });
        console.log(`✅ Day ${day} completed! Progress:`, response.data);
        
        // Notify parent component to refresh progress
        if (onProgressUpdate) {
          onProgressUpdate();
        }
      } catch (err) {
        console.error(`❌ Failed to update progress for day ${day}:`, err);
        setCompleted(false); // Revert if failed
      } finally {
        setUpdating(false);
      }
    } else if (!allTasksCompleted && completed) {
      setCompleted(false);
    }
  };

  const completionPercentage = (completedTasks.size / tasks.length) * 100;

  return (
    <motion.div
      className={`plan-card ${completed ? 'completed' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: day * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="plan-card-header">
        <div className="day-badge">
          <span className="day-number">Day {day}</span>
          {completed && <span className="completion-badge">✅</span>}
        </div>
        <div className="progress-indicator">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="plan-card-content">
        <h3 className="topic-title">
          <span className="topic-icon">🎯</span>
          {topic}
        </h3>

        <div className="tasks-section">
          <div className="tasks-header">
            <span className="tasks-label">Tasks to Complete</span>
            <span className="tasks-count">
              {completedTasks.size}/{tasks.length}
            </span>
          </div>

          <div className="tasks-list">
            {tasks.map((task, index) => (
              <div 
                key={index} 
                className={`task-item ${completedTasks.has(index) ? 'completed' : ''}`}
                onClick={() => !completed && toggleTask(index)}
                style={{ cursor: completed ? 'default' : 'pointer' }}
              >
                <div className="task-checkbox">
                  {completedTasks.has(index) ? '✅' : '⭕'}
                </div>
                <span className="task-text">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {completed && (
          <div className="completion-message">
            <span>🎉</span>
            Great job! Day {day} completed!
          </div>
        )}
      </div>
    </motion.div>
  );
}
