"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PipelineChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function PipelineChart({ data }: PipelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={70}
          tick={{ fontSize: 13, fontWeight: 600, fill: "#374151" }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            fontSize: "13px",
          }}
          formatter={(value: number) => [`${value} leads`, "Jumlah"]}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
