import React from "react";

export default function ProgressBar({ completed, total }) {
  const percent = (completed / total) * 100;

  return (
    <div>
      <div style={{ width: "200px", background: "#ddd" }}>
        <div
          style={{
            width: `${percent}%`,
            background: "green",
            height: "10px",
          }}
        />
      </div>
      <p>
        {completed} / {total} days completed
      </p>
    </div>
  );
}
