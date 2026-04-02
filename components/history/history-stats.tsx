"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface HistoryStatsProps {
  chartData: {
    name: string;
    fullSubject: string;
    topic: string;
    accuracy: number;
    score: number;
    total: number;
    date: string;
  }[];
}

export function HistoryStats({ chartData }: HistoryStatsProps) {
  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 mb-8 max-w-full">
      <div className="flex items-center gap-2 mb-6">
        <MaterialIcon name="monitoring" className="text-primary text-xl" />
        <h3 className="font-headline font-bold text-lg text-on-surface">
          Accuracy Trend
        </h3>
      </div>
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
              opacity={0.4}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: "#f3f4f6" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as HistoryStatsProps["chartData"][0];
                  return (
                    <div className="bg-surface-container-lowest p-3 border border-outline-variant/20 rounded-xl shadow-lg">
                      <p className="font-bold text-sm text-on-surface">
                        {data.fullSubject}
                      </p>
                      <p className="text-[10px] text-secondary mb-2">
                        {data.topic} • {data.date}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-semibold">
                          Accuracy: {data.accuracy}%
                        </span>
                      </div>
                      <p className="text-[10px] text-secondary mt-1 pl-4">
                        Score: {data.score}/{data.total}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => {
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.accuracy >= 75
                        ? "#10b981"
                        : entry.accuracy >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
