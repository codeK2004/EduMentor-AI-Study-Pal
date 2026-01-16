import React from "react";

function Home({ setTab }) {
  const features = [
    {
      icon: "📅",
      title: "Smart Planner",
      description: "AI-generated personalized study plans tailored to your learning goals and timeline.",
      action: () => setTab("planner"),
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: "🧠",
      title: "Interactive Quiz",
      description: "Test your knowledge with AI-generated quizzes and track your progress.",
      action: () => setTab("quiz"),
      color: "from-green-500 to-teal-600"
    },
    {
      icon: "🤖",
      title: "AI Explain",
      description: "Get instant, simple explanations for complex topics with examples and analogies.",
      action: () => setTab("explain"),
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: "📚",
      title: "Resources",
      description: "Discover curated learning materials, videos, and articles for any subject.",
      action: () => setTab("resources"),
      color: "from-orange-500 to-red-600"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievements.",
      action: () => setTab("dashboard"),
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: "📝",
      title: "Smart Notes",
      description: "Organize and manage your study notes with intelligent categorization.",
      action: () => setTab("notes"),
      color: "from-teal-500 to-green-600"
    }
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="home-hero">
        <h1>Welcome to EduMentor AI</h1>
        <p>
          Your intelligent learning companion that creates personalized study plans, 
          generates interactive quizzes, and provides instant explanations to accelerate your learning journey.
        </p>
        <div className="home-actions">
          <button 
            className="primary-btn"
            onClick={() => setTab("planner")}
          >
            <span>🚀</span>
            Start Learning
          </button>
          <button 
            className="secondary-btn"
            onClick={() => setTab("dashboard")}
          >
            <span>📊</span>
            View Progress
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title">Powerful Learning Features</h2>
        <p className="section-subtitle">
          Everything you need to succeed in your learning journey, powered by advanced AI
        </p>
        
        <div className="home-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" onClick={feature.action}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <button className="feature-btn">
                Explore <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Learning?</h2>
          <p>
            Start your personalized learning journey today with AI-powered study plans and interactive quizzes.
          </p>
          <div className="cta-actions">
            <button 
              className="primary-btn cta-btn"
              onClick={() => setTab("planner")}
            >
              <span>🎯</span>
              Create Study Plan
            </button>
            <button 
              className="success-btn cta-btn"
              onClick={() => setTab("quiz")}
            >
              <span>⚡</span>
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;