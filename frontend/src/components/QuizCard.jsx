import React from "react";
import { motion } from "framer-motion";

export default function QuizCard({
  question,
  options,
  selected,
  onSelect,
  correctAnswer,
  explanation,
  showResult,
}) {
  if (!Array.isArray(options)) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4>{question}</h4>

      {options.map((opt, i) => {
        let bg = "#f3f4f6";

        if (selected === opt.key) bg = "#e0e7ff";
        if (showResult && opt.key === correctAnswer)
          bg = "#bbf7d0";
        if (
          showResult &&
          selected === opt.key &&
          opt.key !== correctAnswer
        )
          bg = "#fecaca";

        return (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(opt.key)}
            disabled={showResult}
            style={{
              background: bg,
              width: "100%",
              marginTop: "10px",
              textAlign: "left",
              boxShadow:
                selected === opt.key
                  ? "0 8px 20px rgba(99,102,241,0.25)"
                  : "none",
            }}
          >
            {opt.key}) {opt.text}
          </motion.button>
        );
      })}

      {showResult && (
        <div style={{ marginTop: "12px", fontSize: "14px" }}>
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </motion.div>
  );
}
