import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#f97316", "#60a5fa", "#22c55e"];

export default function StatusChart({ counts }) {
  const total = counts.notDone + counts.ongoing + counts.completed || 1;
  const data = [
    { name: "Not Done", value: counts.notDone },
    { name: "Ongoing", value: counts.ongoing },
    { name: "Completed", value: counts.completed },
  ];

  return (
    <div className="rounded-xl bg-slate-900 px-4 py-3 border border-white/5 shadow-lg">
      <div className="text-sm font-semibold text-white mb-2">
        Status overview
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={1}
              stroke="none"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) =>
                [`${value} (${Math.round((value / total) * 100)}%)`, name]
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-300">
        <div>Not Done {Math.round((counts.notDone / total) * 100)}%</div>
        <div>Ongoing {Math.round((counts.ongoing / total) * 100)}%</div>
        <div>Completed {Math.round((counts.completed / total) * 100)}%</div>
      </div>
    </div>
  );
}