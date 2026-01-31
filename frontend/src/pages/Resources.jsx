import React, { useState } from "react";
import api from "../utils/api";

function Resources() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveUrl, setSaveUrl] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

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

  const saveAllResources = async () => {
    if (!result || !subject) {
      alert("No resources to save");
      return;
    }

    setSavingAll(true);
    try {
      // Parse the resources text to extract individual resources
      const lines = result.split("\n").filter((l) => l.trim() !== "");
      const resourcesToSave = [];
      let currentCategory = "General";
      
      lines.forEach((line) => {
        const clean = line.trim();
        
        // Skip empty lines
        if (!clean) return;
        
        // Check if it's a category header (YouTube:, Articles:, Docs:, etc.)
        if (clean.endsWith(":") && !clean.startsWith("*") && !clean.startsWith("-")) {
          currentCategory = clean.replace(":", "").trim();
          return;
        }
        
        // Process resource items (starting with * or -)
        if (clean.startsWith("*") || clean.startsWith("-")) {
          let content = clean.replace(/^[*-]\s*/, "").trim();
          
          // Skip if empty after cleaning
          if (!content) return;
          
          let title = content;
          let url = null;
          let description = "";
          
          // Extract URL if present
          const urlMatch = content.match(/(https?:\/\/[^\s\)]+)/);
          if (urlMatch) {
            url = urlMatch[1];
            content = content.replace(urlMatch[0], "").trim();
          }
          
          // Split title and description by " – " or " - "
          if (content.includes(" – ")) {
            const parts = content.split(" – ");
            title = parts[0].trim();
            description = parts.slice(1).join(" – ").trim();
          } else if (content.includes(" - ")) {
            const parts = content.split(" - ");
            title = parts[0].trim();
            description = parts.slice(1).join(" - ").trim();
          } else {
            title = content;
          }
          
          // Clean up title from markdown
          title = title.replace(/\*\*/g, "").trim();
          
          // Only add if we have a meaningful title
          if (title && title.length > 2) {
            resourcesToSave.push({
              title: title,
              url: url || `https://www.google.com/search?q=${encodeURIComponent(title + " " + subject)}`,
              description: description || `${currentCategory} resource for ${subject}${topic ? ` - ${topic}` : ''}`,
              category: currentCategory
            });
          }
        }
      });
      
      console.log("Resources to save:", resourcesToSave); // Debug log
      
      if (resourcesToSave.length === 0) {
        alert("No valid resources found to save");
        return;
      }
      
      // Save all resources
      const savePromises = resourcesToSave.map(resource => 
        api.post("/saved/resources", resource)
      );
      
      await Promise.all(savePromises);
      alert(`✅ Successfully saved ${resourcesToSave.length} resources!`);
      
    } catch (err) {
      console.error("Failed to save all resources:", err);
      alert("❌ Failed to save some resources. Check console for details.");
    }
    setSavingAll(false);
  };
  const saveResource = async () => {
    if (!saveTitle.trim() || !saveUrl.trim()) {
      alert("Please enter both title and URL");
      return;
    }

    setSaving(true);
    try {
      await api.post("/saved/resources", {
        title: saveTitle,
        url: saveUrl,
        description: `Resource for ${subject}${topic ? ` - ${topic}` : ''}`,
        category: subject
      });
      alert("✅ Resource saved successfully!");
      setSaveTitle("");
      setSaveUrl("");
    } catch (err) {
      console.error("Failed to save resource:", err);
      alert("❌ Failed to save resource");
    }
    setSaving(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchResources();
    }
  };

  const renderResources = (text) => {
    if (!text) return null;
    
    const lines = text.split("\n").filter((l) => l.trim() !== "");

    return lines.map((line, index) => {
      const clean = line.trim();

      if (clean.startsWith("**") && clean.endsWith(":**")) {
        return (
          <h3 key={index} style={{ marginTop: "20px", marginBottom: "10px", fontSize: "1.25rem", fontWeight: "700" }}>
            {clean.replace(/\*\*/g, "")}
          </h3>
        );
      }

      if (clean.startsWith("*")) {
        const content = clean.replace(/^\*\s*/, "").trim();

        if (content.includes("**")) {
          const parts = content.split("**").filter(Boolean);
          const title = parts[0];
          const description = parts[1] || "";
          
          // Try to extract URL from the content
          const urlMatch = content.match(/(https?:\/\/[^\s\)]+)/);
          const url = urlMatch ? urlMatch[1] : null;
          
          return (
            <div key={index} style={{ 
              marginLeft: "16px", 
              lineHeight: "1.6", 
              marginBottom: "12px",
              padding: "8px",
              background: "#f8fafc",
              borderRadius: "6px",
              border: "1px solid #e5e7eb"
            }}>
              <p style={{ margin: "0 0 4px 0" }}>
                <strong>{title}</strong>
                {description && ` – ${description}`}
              </p>
              {url && (
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: "#6366f1", 
                      textDecoration: "none", 
                      fontSize: "14px",
                      padding: "2px 6px",
                      background: "#eff6ff",
                      borderRadius: "4px"
                    }}
                  >
                    🔗 Visit Link
                  </a>
                  <button
                    onClick={() => {
                      setSaveTitle(title);
                      setSaveUrl(url);
                    }}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    💾 Quick Save
                  </button>
                </div>
              )}
            </div>
          );
        }

        // Handle regular bullet points
        const urlMatch = content.match(/(https?:\/\/[^\s\)]+)/);
        const url = urlMatch ? urlMatch[1] : null;
        const textWithoutUrl = content.replace(/(https?:\/\/[^\s\)]+)/, "").trim();

        return (
          <div key={index} style={{ 
            marginLeft: "16px", 
            lineHeight: "1.6", 
            marginBottom: "8px",
            padding: url ? "6px" : "0",
            background: url ? "#f8fafc" : "transparent",
            borderRadius: url ? "4px" : "0",
            border: url ? "1px solid #e5e7eb" : "none"
          }}>
            <p style={{ margin: "0" }}>• {textWithoutUrl}</p>
            {url && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: "#6366f1", 
                    textDecoration: "none", 
                    fontSize: "14px",
                    padding: "2px 6px",
                    background: "#eff6ff",
                    borderRadius: "4px"
                  }}
                >
                  🔗 Visit Link
                </a>
                <button
                  onClick={() => {
                    setSaveTitle(textWithoutUrl.replace("• ", ""));
                    setSaveUrl(url);
                  }}
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  💾 Quick Save
                </button>
              </div>
            )}
          </div>
        );
      }

      return (
        <p key={index} style={{ lineHeight: "1.6", color: "#374151", marginBottom: "8px" }}>
          {clean.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">📚</span>
          Learning Resources
        </h1>
        <p className="page-subtitle">
          Discover curated learning materials, videos, and articles for any subject
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Find Resources</h2>
          <p>Get AI-curated learning materials tailored to your needs</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 600, 
            color: '#1f2937' 
          }}>
            📖 Subject
          </label>
          <input
            placeholder="e.g., Python, DevOps, Machine Learning"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 600, 
            color: '#1f2937' 
          }}>
            🎯 Specific Topic (Optional)
          </label>
          <input
            placeholder="e.g., Jenkins, Docker, Neural Networks"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button 
          className="primary-btn"
          onClick={fetchResources}
          disabled={loading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? "Finding resources..." : "🔍 Get Resources"}
        </button>

        {error && (
          <div style={{ 
            color: '#ef4444', 
            fontSize: '14px', 
            marginTop: '1rem',
            padding: '8px',
            background: '#fef2f2',
            borderRadius: '6px'
          }}>
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="card">
          <div className="card-header">
            <h2>📖 Suggested Resources</h2>
            <p>Curated learning materials for {subject}{topic && ` - ${topic}`}</p>
            <button
              onClick={saveAllResources}
              disabled={savingAll}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: savingAll ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                opacity: savingAll ? 0.6 : 1
              }}
            >
              {savingAll ? "Saving All..." : "💾 Save All Resources"}
            </button>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {renderResources(result)}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>💾 Save a Resource</h2>
          <p>Bookmark useful resources for later reference</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            placeholder="Resource title (e.g., Python Official Documentation)"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              fontFamily: 'inherit',
              marginBottom: '1rem'
            }}
          />
          <input
            placeholder="Resource URL (e.g., https://docs.python.org)"
            value={saveUrl}
            onChange={(e) => setSaveUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <button 
          className="secondary-btn"
          onClick={saveResource}
          disabled={saving}
          style={{ width: '100%' }}
        >
          {saving ? "Saving..." : "💾 Save Resource"}
        </button>
      </div>
    </div>
  );
}

export default Resources;