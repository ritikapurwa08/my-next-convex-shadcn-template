"use client";

import { cn } from "@/lib/utils";
import { QuestionState, QuestionStatus } from "@/types/quiz";

interface QuestionMapProps {
  questionStates: QuestionState[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const statusConfig: Record<QuestionStatus, string> = {
  answered: "bg-primary text-white",
  review: "bg-transparent border-2 border-amber-500 text-amber-600",
  skipped: "bg-secondary/10 text-secondary border border-outline-variant/30",
  unvisited:
    "bg-surface-container text-on-surface-variant border border-outline-variant/20",
};

export function QuestionMap({
  questionStates,
  currentIndex,
  onNavigate,
}: QuestionMapProps) {
  const answered = questionStates.filter((s) => s.status === "answered").length;
  const total = questionStates.length;

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-headline font-bold text-on-surface">
          Question Map
        </h3>
        <span className="text-xs font-bold text-secondary bg-surface-container px-2 py-1 rounded-lg">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {questionStates.map((state, i) => {
          const isCurrent = i === currentIndex;
          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={cn(
                "aspect-square rounded-lg text-xs font-bold transition-all duration-200 active:scale-90",
                isCurrent
                  ? "ring-2 ring-primary ring-offset-1 bg-primary text-white scale-105"
                  : statusConfig[state.status],
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      {/* Legend */}
      <div className="space-y-1.5">
        <LegendItem
          color="bg-primary"
          label="Answered"
          count={questionStates.filter((s) => s.status === "answered").length}
        />
        <LegendItem
          color="border-2 border-amber-500 bg-transparent"
          label="Marked for Review"
          count={questionStates.filter((s) => s.status === "review").length}
          isOutline
        />
        <LegendItem
          color="bg-secondary/10 border border-outline-variant/30"
          label="Skipped"
          count={questionStates.filter((s) => s.status === "skipped").length}
        />
        <LegendItem
          color="bg-surface-container border border-outline-variant/20"
          label="Unvisited"
          count={questionStates.filter((s) => s.status === "unvisited").length}
        />
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  count,
  isOutline,
}: {
  color: string;
  label: string;
  count: number;
  isOutline?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("w-4 h-4 rounded-md shrink-0", color)} />
        <span className="text-[11px] text-secondary">{label}</span>
      </div>
      <span className="text-[11px] font-bold text-on-surface">{count}</span>
    </div>
  );
}
