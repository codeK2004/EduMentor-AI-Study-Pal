import React, { useState, useEffect } from "react";
import api from "../utils/api";

function SavedContent() {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [resources, setResources] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState(null);

  const fetchSavedContent = async () => {
    setLoading(true);
    try {
      const [quizzesRes, resourcesRes, explanationsRes] = await Promise.all([
        api.get("/saved/quizzes"),
        api.get("/saved/resources"),
        api.get("/saved/explanations")
      ]);
      
      console.log("Fetched quizzes:", quizzesRes.data); // Debug log
      setQuizzes(quizzesRes.data);
      setResources(resourcesRes.data);
      setExplanations(explanationsRes.data);
    } catch (err) {
      console.error("Failed to fetch saved content:", err);
    }
    setLoading(false);
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await api.delete(`/saved/quizzes/${quizId}`);
      fetchSavedContent();
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    }
  };

  const deleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      await api.delete(`/saved/resources/${resourceId}`);
      fetchSavedContent();
    } catch (err) {
      console.error("Failed to delete resource:", err);
    }
  };

  const deleteExplanation = async (explanationId) => {
    if (!window.confirm("Are you sure you want to delete this explanation?")) return;
    
    try {
      await api.delete(`/saved/explanations/${explanationId}`);
      fetchSavedContent();
    } catch (err) {
      console.error("Failed to delete explanation:", err);
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading your saved content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">💾</span>
          Saved Content
        </h1>
        <p className="page-subtitle">
          Access all your saved quizzes, resources, and AI explanations
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
          <button
            className={activeTab === "quizzes" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("quizzes")}
          >
            🧠 Quizzes ({quizzes.length})
          </button>
          <button
            className={activeTab === "resources" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("resources")}
          >
            📚 Resources ({resources.length})
          </button>
          <button
            className={activeTab === "explanations" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("explanations")}
          >
            🤖 Explanations ({explanations.length})
          </button>
        </div>

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div>
            {quizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
                <h3>No Saved Quizzes</h3>
                <p>Take some quizzes to see them here!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {quizzes.map((quiz) => (
                  <div key={quiz.id} style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    padding: '1.5rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
                          {quiz.topic}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                          <span>📊 Score: {quiz.score}/{quiz.total_questions} ({quiz.percentage}%)</span>
                          <span>📅 {new Date(quiz.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ 
                          background: quiz.percentage >= 60 ? '#dcfce7' : '#fef2f2',
                          color: quiz.percentage >= 60 ? '#166534' : '#991b1b',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'inline-block',
                          marginBottom: '1rem'
                        }}>
                          {quiz.percentage >= 60 ? '✅ Passed' : '❌ Failed'} - {quiz.percentage}%
                        </div>
                        
                        {/* View Quiz Details Button */}
                        <div style={{ marginTop: '1rem' }}>
                          <button
                            onClick={() => {
                              console.log("Quiz data for expansion:", quiz); // Debug log
                              setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id);
                            }}
                            style={{
                              background: '#6366f1',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              marginRight: '0.5rem'
                            }}
                          >
                            {expandedQuiz === quiz.id ? '🔼 Hide Details' : '🔽 View Questions'}
                          </button>
                        </div>

                        {/* Expanded Quiz Details */}
                        {expandedQuiz === quiz.id && (
                          <div style={{ 
                            marginTop: '1rem', 
                            padding: '1rem', 
                            background: '#ffffff', 
                            borderRadius: '8px',
                            border: '1px solid #d1d5db'
                          }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Quiz Questions & Answers:</h4>
                            
                            {quiz.questions && quiz.questions.questions ? (
                              quiz.questions.questions.map((question, qIndex) => (
                                <div key={qIndex} style={{ 
                                  marginBottom: '1.5rem', 
                                  padding: '1rem', 
                                  background: '#f9fafb',
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <p style={{ 
                                    fontWeight: '600', 
                                    marginBottom: '0.5rem',
                                    color: '#1f2937'
                                  }}>
                                    Q{qIndex + 1}: {question.question}
                                  </p>
                                  
                                  <div style={{ marginBottom: '0.5rem' }}>
                                    {question.options && question.options.map((option, oIndex) => {
                                      // Handle both old format (array of strings) and new format (array of objects)
                                      const optionText = typeof option === 'string' ? option : option.text;
                                      const optionKey = typeof option === 'string' ? String.fromCharCode(65 + oIndex) : option.key;
                                      
                                      const isCorrect = question.answer === optionKey;
                                      const userAnswer = quiz.questions.answers && quiz.questions.answers[qIndex];
                                      const isUserChoice = userAnswer === optionKey;
                                      
                                      return (
                                        <div key={oIndex} style={{ 
                                          padding: '0.25rem 0.5rem',
                                          margin: '0.25rem 0',
                                          borderRadius: '4px',
                                          background: isCorrect ? '#dcfce7' : (isUserChoice && !isCorrect ? '#fef2f2' : '#f3f4f6'),
                                          color: isCorrect ? '#166534' : (isUserChoice && !isCorrect ? '#991b1b' : '#374151'),
                                          fontSize: '0.875rem'
                                        }}>
                                          {optionKey}. {optionText} 
                                          {isCorrect && ' ✅'}
                                          {isUserChoice && !isCorrect && ' ❌ (Your answer)'}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  {question.explanation && (
                                    <div style={{ 
                                      marginTop: '0.5rem',
                                      padding: '0.5rem',
                                      background: '#eff6ff',
                                      borderRadius: '4px',
                                      fontSize: '0.875rem',
                                      color: '#1e40af'
                                    }}>
                                      <strong>Explanation:</strong> {question.explanation}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div style={{ 
                                padding: '1rem', 
                                background: '#fef2f2', 
                                borderRadius: '6px',
                                color: '#991b1b'
                              }}>
                                <p>❌ Quiz questions data not available</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                  This might be an older quiz saved before the detailed view feature was added.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => deleteQuiz(quiz.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          fontSize: '1.2rem'
                        }}
                        title="Delete quiz"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div>
            {resources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <h3>No Saved Resources</h3>
                <p>Save some resources to see them here!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {resources.map((resource) => (
                  <div key={resource.id} style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    padding: '1.5rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#6366f1', textDecoration: 'none' }}
                          >
                            {resource.title} 🔗
                          </a>
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          <span>📁 {resource.category}</span>
                          <span>📅 {new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>
                        {resource.description && (
                          <p style={{ margin: '0', color: '#374151', fontSize: '0.9rem' }}>
                            {resource.description}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteResource(resource.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          fontSize: '1.2rem'
                        }}
                        title="Delete resource"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explanations Tab */}
        {activeTab === "explanations" && (
          <div>
            {explanations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3>No Saved Explanations</h3>
                <p>Save some AI explanations to see them here!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {explanations.map((explanation) => (
                  <div key={explanation.id} style={{ 
                    background: '#f8fafc', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    padding: '1.5rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
                          {explanation.topic}
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                          📅 {new Date(explanation.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Question:</strong>
                          <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#4b5563' }}>
                            {explanation.question}
                          </p>
                        </div>
                        <div>
                          <strong>Explanation:</strong>
                          <div style={{ 
                            margin: '0.5rem 0', 
                            whiteSpace: 'pre-wrap', 
                            lineHeight: '1.6', 
                            color: '#374151',
                            background: '#ffffff',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db'
                          }}>
                            {explanation.explanation}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteExplanation(explanation.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          fontSize: '1.2rem'
                        }}
                        title="Delete explanation"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedContent;