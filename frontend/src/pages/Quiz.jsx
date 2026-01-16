import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Card from "../components/Card";
import QuizCard from "../components/QuizCard";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Generate quiz from backend
  const generateQuiz = async () => {
    setError("");
    setSubmitted(false);
    setAnswers({});
    setQuestions([]);
    setLoading(true);

    if (!topic.trim()) {
      setError("Please enter a topic");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/quiz/generate?topic=${topic}`);

      // 🔒 Validate response
      if (!res.data || !Array.isArray(res.data.questions)) {
        throw new Error("Invalid quiz response");
      }

      // Filter only valid questions
      const safeQuestions = res.data.questions.filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.answer &&
          q.explanation
      );

      if (safeQuestions.length === 0) {
        throw new Error("No valid questions received");
      }

      setQuestions(safeQuestions);
    } catch (err) {
      console.error("QUIZ ERROR:", err);
      setError(
        "Quiz could not be generated right now. Please try again."
      );
    }

    setLoading(false);
  };

  // 🔹 Calculate score correctly (KEY vs KEY)
  const score = questions.filter(
    (q, i) => answers[i] === q.answer
  ).length;

  // 🔹 Submit quiz + update progress
  const submitQuiz = async () => {
    setSubmitted(true);

    // Pass condition: 60%
    if (score >= questions.length * 0.6) {
      try {
        await api.post("/progress/complete-day");
      } catch (err) {
        console.error("Progress update failed", err);
      }
    }
  };

  return (
    <div className="page-container">
      {/* 🔹 Quiz Generator */}
      <Card title="🧠 Quiz">
        <input
          placeholder="Topic (from your study plan)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={generateQuiz}
          disabled={loading}
        >
          {loading ? "Generating..." : "Create Quiz"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </Card>

      {/* 🔹 Quiz Questions */}
      {questions.length > 0 &&
        questions.map((q, i) => (
          <QuizCard
            key={i}
            question={q.question}
            options={q.options}
            selected={answers[i]}
            correctAnswer={q.answer}
            explanation={q.explanation}
            showResult={submitted}
            onSelect={(optKey) =>
              setAnswers({ ...answers, [i]: optKey })
            }
          />
        ))}

      {/* 🔹 Result */}
      {questions.length > 0 && (
        <Card title="Result">
          {!submitted ? (
            <button
              className="primary-btn"
              onClick={submitQuiz}
            >
              Submit Quiz
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <h3 className="score-text">
                Score: {score} / {questions.length}
              </h3>

              <p style={{ marginTop: "8px" }}>
                {score >= questions.length * 0.6
                  ? "🎉 Great job! This day is marked as completed."
                  : "💡 Review the explanations and try again."}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default Quiz;
