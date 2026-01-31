import React, { useState } from "react";
import api from "../utils/api";
import Card from "../components/Card";

/* 🧠 SAFE formatter (NO <ul> nesting) */
function renderExplain(text) {
  return text
    .split("\n")
    .filter(Boolean)
    .map((line, i) => {
      const clean = line.replace(/[*•]/g, "").trim();

      // Headings
      if (
        clean.toLowerCase().includes("simple terms") ||
        clean.toLowerCase().includes("key idea") ||
        clean.toLowerCase().includes("example")
      ) {
        return <h4 key={i}>{clean}</h4>;
      }

      // Numbered steps
      if (/^\d+\./.test(clean)) {
        return (
          <p key={i} style={{ marginLeft: "12px" }}>
            {clean}
          </p>
        );
      }

      // Normal text
      return <p key={i}>{clean}</p>;
    });
}

export default function AIExplain() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleExplain = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const res = await api.post("/explain/", { question });

    setAnswer(res.data.explanation);
    setLoading(false);
  };

  const saveExplanation = async () => {
    if (!question.trim() || !answer.trim()) return;

    setSaving(true);
    try {
      await api.post("/saved/explanations", {
        topic: question.split(' ').slice(0, 3).join(' '), // First 3 words as topic
        question: question,
        explanation: answer
      });
      alert("✅ Explanation saved successfully!");
    } catch (err) {
      console.error("Failed to save explanation:", err);
      alert("❌ Failed to save explanation");
    }
    setSaving(false);
  };

  return (
    <div className="page-container">
      <Card>
        <h2>🧠 AI Explain</h2>

        <input
          placeholder="Explain Jenkins workflow like I'm 10"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button className="primary-btn" onClick={handleExplain}>
          {loading ? "Thinking..." : "Explain"}
        </button>
      </Card>

      {answer && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>📘 Explanation</h3>
            <button 
              className="secondary-btn" 
              onClick={saveExplanation}
              disabled={saving}
            >
              {saving ? "Saving..." : "💾 Save"}
            </button>
          </div>
          <div>{renderExplain(answer)}</div>
        </Card>
      )}
    </div>
  );
}
