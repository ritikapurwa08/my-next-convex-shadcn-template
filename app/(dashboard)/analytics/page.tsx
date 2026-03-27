"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const stats = useQuery(api.quizHistory.stats);
  const records = useQuery(api.quizHistory.listByUser, {});

  // Compute per-subject stats from records
  const subjectStats = (() => {
    if (!records || records.length === 0) return [];
    const map: Record<
      string,
      { total: number; accuracySum: number; count: number }
    > = {};
    records.forEach(
      (r: { subject: string | number; score: number; accuracy: number }) => {
        if (!map[r.subject])
          map[r.subject] = { total: 0, accuracySum: 0, count: 0 };
        map[r.subject].count++;
        map[r.subject].total += r.score;
        map[r.subject].accuracySum += r.accuracy;
      },
    );
    return Object.entries(map)
      .map(([subject, d]) => ({
        subject,
        avgAccuracy: Math.round(d.accuracySum / d.count),
        quizCount: d.count,
      }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy);
  })();

  // Last 7 records for sparkline (reversed for chronological order)
  const recentTrend = records ? [...records].reverse().slice(0, 7) : [];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold tracking-wider">
          REPORTS
        </span>
        <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mt-2">
          Academic Performance
        </h2>
        <p className="text-secondary font-body mt-1 text-sm">
          Your personalised insights and growth metrics.
        </p>
      </header>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <SummaryCard
          icon="star"
          label="Average Accuracy"
          value={stats ? `${stats.avgAccuracy}%` : "—"}
          borderColor="border-primary"
        />
        <SummaryCard
          icon="emoji_events"
          label="Best Subject"
          value={stats?.bestSubject ?? "—"}
          borderColor="border-primary-container"
          small
        />
        <SummaryCard
          icon="history_edu"
          label="Total Quizzes"
          value={stats ? String(stats.totalQuizzes) : "—"}
          borderColor="border-outline-variant"
        />
      </div>

      {/* Accuracy trend */}
      {recentTrend.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-7 mb-6">
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">
            Accuracy Trend
          </h3>
          <p className="text-xs text-secondary mb-6">
            Last {recentTrend.length} quiz attempts
          </p>
          <div className="flex items-end gap-3 h-32">
            {recentTrend.map((r, i) => (
              <div
                key={r._id}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[9px] font-bold text-secondary">
                  {r.accuracy}%
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    r.accuracy >= 75
                      ? "bg-primary"
                      : r.accuracy >= 50
                        ? "bg-amber-400"
                        : "bg-error/70",
                  )}
                  style={{ height: `${(r.accuracy / 100) * 100}px` }}
                />
                <span className="text-[8px] text-secondary">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject mastery */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Subject Mastery
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Average accuracy per subject
            </p>
          </div>
        </div>

        {subjectStats.length === 0 && (
          <div className="py-12 text-center">
            <MaterialIcon
              name="bar_chart"
              className="text-4xl text-outline mb-3"
            />
            <p className="text-sm text-secondary">
              Complete quizzes to see subject mastery here.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {subjectStats.map((s) => (
            <div key={s.subject} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface">{s.subject}</span>
                  <span className="text-[10px] text-secondary bg-surface-container px-2 py-0.5 rounded-full">
                    {s.quizCount} quiz{s.quizCount > 1 ? "zes" : ""}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-bold text-xs",
                    s.avgAccuracy >= 75
                      ? "text-primary"
                      : s.avgAccuracy >= 50
                        ? "text-amber-600"
                        : "text-error",
                  )}
                >
                  {s.avgAccuracy}%
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    s.avgAccuracy >= 75
                      ? "bg-primary"
                      : s.avgAccuracy >= 50
                        ? "bg-amber-400"
                        : "bg-error/70",
                  )}
                  style={{ width: `${s.avgAccuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  borderColor,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  borderColor: string;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-surface-container-lowest border-t-2 shadow-sm",
        borderColor,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <MaterialIcon name={icon} />
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "font-headline font-extrabold text-on-surface",
          small ? "text-lg" : "text-3xl",
        )}
      >
        {value}
      </p>
    </div>
  );
}
