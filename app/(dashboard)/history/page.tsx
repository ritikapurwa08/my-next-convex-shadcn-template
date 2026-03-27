"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const SUBJECTS = [
  "All Subjects",
  "Rajasthan History",
  "Rajasthan Geography",
  "Indian Polity",
  "Art & Culture",
  "Indian Geography",
  "Psychology",
];
const TIME_FILTERS = [
  { label: "All Time", value: undefined },
  { label: "Today", value: "today" as const },
  { label: "This Week", value: "week" as const },
  { label: "This Month", value: "month" as const },
];

export default function HistoryPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined,
  );
  const [timeFilter, setTimeFilter] = useState<
    "today" | "week" | "month" | undefined
  >(undefined);

  const records = useQuery(api.quizHistory.listByUser, {
    subject: selectedSubject,
    timeFilter,
  });

  const stats = useQuery(api.quizHistory.stats);

  const chartData = useMemo(() => {
    if (!records) return [];
    // Reverse to show chronological order left-to-right
    return [...records].reverse().map((r, i) => ({
      name: `Q${i + 1}`,
      fullSubject: r.subject,
      topic: r.topic,
      accuracy: r.accuracy,
      score: r.score,
      total: r.totalQuestions,
      date: new Date(r.answeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    }));
  }, [records]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="border-b border-outline-variant/20 pb-6">
        <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
          Test History
        </h2>
        <p className="text-secondary font-body text-sm mt-1">
          Review your past performance and identify areas for improvement.
        </p>
      </header>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon="quiz"
            label="Total Quizzes"
            value={String(stats.totalQuizzes)}
          />
          <StatCard
            icon="percent"
            label="Avg Accuracy"
            value={`${stats.avgAccuracy}%`}
          />
          <StatCard
            icon="star"
            label="Best Subject"
            value={stats.bestSubject}
            small
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Time filter */}
        <div className="flex gap-1.5 bg-surface-container rounded-xl p-1">
          {TIME_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setTimeFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                timeFilter === f.value
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-secondary hover:text-on-surface",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Subject filter */}
        <div className="flex gap-1.5 flex-wrap">
          {SUBJECTS.map((s) => {
            const val = s === "All Subjects" ? undefined : s;
            return (
              <button
                key={s}
                onClick={() => setSelectedSubject(val)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                  selectedSubject === val
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-outline-variant/20 text-secondary hover:border-primary/20 hover:text-on-surface",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Records list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">
          Recent Assessments {records !== undefined && `(${records.length})`}
        </h3>

        {records === undefined && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-surface-container rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {records !== undefined && records.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MaterialIcon
              name="history"
              className="text-5xl text-outline mb-4"
            />
            <p className="font-headline font-bold text-on-surface">
              No records yet
            </p>
            <p className="text-sm text-secondary mt-1">
              Complete a quiz to see your history here.
            </p>
          </div>
        )}

        {records && records.length > 0 && (
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 mb-8 max-w-full">
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon name="monitoring" className="text-primary text-xl" />
              <h3 className="font-headline font-bold text-lg text-on-surface">Accuracy Trend</h3>
            </div>
            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.4} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-surface-container-lowest p-3 border border-outline-variant/20 rounded-xl shadow-lg">
                            <p className="font-bold text-sm text-on-surface">{data.fullSubject}</p>
                            <p className="text-[10px] text-secondary mb-2">{data.topic} • {data.date}</p>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              <span className="text-xs font-semibold">Accuracy: {data.accuracy}%</span>
                            </div>
                            <p className="text-[10px] text-secondary mt-1 pl-4">Score: {data.score}/{data.total}</p>
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
                          fill={entry.accuracy >= 75 ? "#10b981" : entry.accuracy >= 50 ? "#f59e0b" : "#ef4444"} 
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {records?.map((record) => {
          const isGood = record.accuracy >= 75;
          const isMid = record.accuracy >= 50 && record.accuracy < 75;
          const date = new Date(record.answeredAt);
          const dateStr = date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const timeStr = date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={record._id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:shadow-lg hover:border-primary/20 transition-all duration-300 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MaterialIcon name="history_edu" className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-base">
                    {record.subject}
                  </h4>
                  <p className="text-xs text-secondary font-body mt-0.5">
                    {record.topic} · {dateStr}, {timeStr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:justify-end">
                {/* Mini accuracy bar */}
                <div className="hidden sm:block w-24">
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        isGood
                          ? "bg-primary"
                          : isMid
                            ? "bg-amber-500"
                            : "bg-error",
                      )}
                      style={{ width: `${record.accuracy}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-secondary mt-1 text-right">
                    {record.accuracy}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-headline font-extrabold text-lg text-on-surface">
                    {record.score}/{record.totalQuestions}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isGood
                        ? "text-primary"
                        : isMid
                          ? "text-amber-600"
                          : "text-error",
                    )}
                  >
                    {isGood ? "Excellent" : isMid ? "Needs Review" : "Poor"}
                  </p>
                </div>

                <div className="text-right text-xs text-secondary">
                  <MaterialIcon name="timer" className="text-sm mr-1" />
                  {Math.floor(record.timeTaken / 60)}m {record.timeTaken % 60}s
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <MaterialIcon name={icon} className="text-base" />
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "font-headline font-extrabold text-on-surface",
          small ? "text-base" : "text-3xl",
        )}
      >
        {value}
      </p>
    </div>
  );
}
