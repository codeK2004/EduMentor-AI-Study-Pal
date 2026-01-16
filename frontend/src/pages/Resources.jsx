import React, { useState } from "react";
import api from "../utils/api";

/* 🧠 Render AI text in a clean, readable way */
function renderResources(text) {
  if (!text) return null;
  
  const lines = text.split("\n").filter((l) => l.trim() !== "");

  return lines.map((line, index) => {
    const clean = line.trim();

    // Section headings like **YouTube:**
    if (clean.startsWith("**") && clean.endsWith(":**")) {
      return (
        <h3 key={index} style={{ marginTop: "20px", marginBottom: "10px", fontSize: "1.25rem", fontWeight: "700" }}>
          {clean.replace(/\*\*/g, "")}
        </h3>
      );
    }

    // Bullet points starting with *
    if (clean.startsWith("*")) {
      const content = clean.replace(/^\*\s*/, "").trim();

      // Bold title inside bullet
      if (content.includes("**")) {
        const parts = content.split("**").filter(Boolean);

        return (
          <p key={index} style={{ marginLeft: "16px", lineHeight: "1.6", marginBottom: "8px" }}>
            <strong>{parts[0]}</strong>
            {parts[1] ? " – " + parts[1] : ""}
          </p>
        );
      }

      return (
        <p key={index} style={{ marginLeft: "16px", lineHeight: "1.6", marginBottom: "8px" }}>
          • {content}
        </p>
      );
    }

    // Normal paragraph (intro text)
    return (
      <p key={index} style={{ lineHeight: "1.6", color: "#374151", marginBottom: "8px" }}>
        {clean.replace(/\*\*/g, "")}
      </p>
    );
  });
}

export default function Resources() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    if (!subject.trim()) {
      setError("Please enter a subject");
      return;
    }

    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await api.post("/resources/", { 
        subject: subject.trim(), 
        topic: topic.trim() || null 
      });
      
      if (res.data && res.data.resources) {
        setResult(res.data.resources);
      } else {
        setError("No resources found. Please try again.");
      }
    } catch (err) {
      console.error("Resources error:", err);
      setError("⚠️ Failed to fetch resources. Please try again.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchResources();
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📚</span>
          Learning Resources
        </h1>
        <p className="page-subtitle">
          Discover curated learning materials, videos, and articles for any subject
        </p>
      </div>

      {/* Input Card */}
      <div className="card">
        <div className="card-header">
          <h2>Find Resources</h2>
          <p>Get AI-curated learning materials tailored to your needs</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '0.75rem', 
            fontWeight: 600, 
            color: 'var(--text-main)' 
          }}>
            <span style={{ fontSize: '1.2rem' }}>📖</span>
            Subject
          </label>
          <input
            placeholder="e.g., Python, DevOps, Machine Learning"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border-soft)',
              fontSize: '1rem',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              marginBottom: 0
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '0.75rem', 
            fontWeight: 600, 
            color: 'var(--text-main)' 
          }}>
            <span style={{ fontSize: '1.2rem' }}>🎯</span>
            Specific Topic (Optional)
          </label>
          <input
            placeholder="e.g., Jenkins, Docker, Neural Networks"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: '2px solid var(--border-soft)',
              fontSize: '1rem',
              background: '#ffffff',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              marginBottom: 0
            }}
          />
        </div>

        <button 
          className={`primary-btn ${loading ? 'loading' : ''}`}
          onClick={fetchResources}
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Finding resources...
            </>
          ) : (
            <>
              <span>🔍</span>
              Get Resources
            </>
          )}
        </button>

        {error && (
          <div style={{ 
            color: 'var(--error)', 
            fontSize: '0.875rem', 
            marginTop: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Output Card */}
      {result && (
        <div className="card">
          <div className="card-header">
            <h2>📖 Suggested Resources</h2>
            <p>Curated learning materials for {subject}{topic && ` - ${topic}`}</p>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {renderResources(result)}
          </div>
        </div>
      )}
    </div>
  );
}
