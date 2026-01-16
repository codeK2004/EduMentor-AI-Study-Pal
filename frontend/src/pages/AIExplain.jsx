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

  const handleExplain = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    const res = await api.post("/explain/", { question });

    setAnswer(res.data.explanation);
    setLoading(false);
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
          <h3>📘 Explanation</h3>
          <div>{renderExplain(answer)}</div>
        </Card>
      )}
    </div>
  );
}
