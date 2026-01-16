import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#e5e7eb"];

export default function ProgressPie({ completed, total }) {
  const data = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: total - completed },
  ];

  return (
    <PieChart width={280} height={280}>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={90}
        animationDuration={900}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i]} />
        ))}
      </Pie>
    </PieChart>
  );
}
