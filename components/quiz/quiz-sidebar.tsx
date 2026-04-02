import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface QuizSidebarProps {
  labels: {
    topic: string;
    set: string;
  };
  timeLeft: number;
  timerDanger: boolean;
  answeredCount: number;
  totalQuestions: number;
  progress: number;
  current: number;
  onPageChange: (index: number) => void;
  answers: Record<number, string>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function QuizSidebar({
  labels,
  timeLeft,
  timerDanger,
  answeredCount,
  totalQuestions,
  progress,
  current,
  onPageChange,
  answers,
  isSubmitting,
  onSubmit,
}: QuizSidebarProps) {
  return (
    <aside className="w-80 h-screen fixed right-0 top-0 bg-surface-container-low border-l border-outline-variant/20 p-8 flex flex-col overflow-y-auto z-10 animate-in fade-in slide-in-from-right-4 duration-500 pt-10">
      <h4 className="flex items-center gap-2 text-xs font-label font-bold text-secondary uppercase tracking-[0.15em] mb-6 mt-8">
        <MaterialIcon name="timer" className="text-secondary" />
        Quiz Status
      </h4>

      <div className="space-y-6 flex-1">
        <div className="mb-6 space-y-2">
          <h1 className="text-sm font-label font-bold text-secondary uppercase tracking-[0.15em]">
            {labels.topic}
          </h1>
          <h2 className="text-sm font-headline font-extrabold text-on-surface">
            {labels.set}
          </h2>
        </div>
        {/* Metrics & Progress Card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 shadow-sm relative overflow-hidden">
          {/* Soft background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <div className="grid grid-cols-2 gap-4 divide-x divide-outline-variant/10 mb-5 relative z-10">
            {/* Timer */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">
                Time Left
              </span>
              <div
                className={cn(
                  "font-headline font-bold text-2xl tabular-nums mt-0.5",
                  timerDanger ? "text-error animate-pulse" : "text-on-surface",
                )}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Stats */}
            <div className="pl-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">
                Answered
              </span>
              <div className="font-headline font-bold text-2xl text-on-surface tabular-nums flex items-baseline gap-1 mt-0.5">
                <span className="text-primary">{answeredCount}</span>
                <span className="text-sm text-secondary font-medium">
                  / {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4 border-t border-outline-variant/10 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">
                Progress
              </span>
              <span className="text-[10px] font-bold text-secondary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Palette */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">
            Question Palette
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isCurrent = i === current;
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(i)}
                  className={cn(
                    "w-full aspect-square rounded-lg text-xs font-bold transition-all",
                    isCurrent
                      ? "bg-primary text-white ring-2 ring-primary/30 scale-110"
                      : isAnswered
                        ? "bg-primary/15 text-primary hover:bg-primary/25"
                        : "bg-surface-container text-secondary hover:bg-surface-container-high",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        id="btn-submit"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-40 transition-all font-headline"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Submit Quiz
            <MaterialIcon name="check_circle" className="text-lg" />
          </>
        )}
      </button>
    </aside>
  );
}
