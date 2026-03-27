"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { QuizResult } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onGoHome: () => void;
}

export function QuizResultScreen({
  result,
  onRetry,
  onGoHome,
}: QuizResultScreenProps) {
  const {
    score,
    totalQuestions,
    accuracy,
    timeTaken,
    questions,
    questionStates,
    subject,
    topic,
  } = result;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const grade =
    accuracy >= 90
      ? { label: "Excellent", color: "text-primary", bg: "bg-primary/10" }
      : accuracy >= 75
        ? { label: "Good", color: "text-green-600", bg: "bg-green-50" }
        : accuracy >= 50
          ? { label: "Average", color: "text-amber-600", bg: "bg-amber-50" }
          : {
              label: "Needs Work",
              color: "text-error",
              bg: "bg-error-container/20",
            };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero score card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 p-10 text-center shadow-sm">
        <div
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6",
            grade.bg,
            grade.color,
          )}
        >
          <MaterialIcon name="stars" className="text-base" />
          {grade.label}
        </div>

        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-7xl font-headline font-extrabold text-on-surface">
            {score}
          </span>
          <span className="text-2xl text-secondary font-headline">
            / {totalQuestions}
          </span>
        </div>
        <p className="text-secondary text-sm font-body mb-1">
          {subject} · {topic}
        </p>

        <div className="grid grid-cols-3 gap-4 mt-10 max-w-sm mx-auto">
          <StatPill icon="percent" label="Accuracy" value={`${accuracy}%`} />
          <StatPill
            icon="timer"
            label="Time"
            value={`${minutes}m ${seconds}s`}
          />
          <StatPill
            icon="close"
            label="Wrong"
            value={`${totalQuestions - score}`}
          />
        </div>
      </div>

      {/* Accuracy circle visual */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 flex items-center gap-8">
        <AccuracyRing accuracy={accuracy} />
        <div className="space-y-3 flex-1">
          <h3 className="font-headline font-bold text-lg text-on-surface">
            Performance Breakdown
          </h3>
          <div className="space-y-2">
            <MiniBar
              label="Correct"
              value={score}
              total={totalQuestions}
              color="bg-primary"
            />
            <MiniBar
              label="Wrong"
              value={totalQuestions - score}
              total={totalQuestions}
              color="bg-error"
            />
            <MiniBar
              label="Marked for Review"
              value={questionStates.filter((s) => s.status === "review").length}
              total={totalQuestions}
              color="bg-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Answer review */}
      <div className="space-y-4">
        <h3 className="font-headline font-bold text-lg text-on-surface px-1">
          Answer Review
        </h3>
        {questions.map((q, i) => {
          const state = questionStates[i];
          const isCorrect = state.selectedOption === q.correctAnswer;
          const isUnanswered = !state.selectedOption;

          return (
            <div
              key={q.id}
              className={cn(
                "rounded-2xl border p-6 space-y-4",
                isUnanswered
                  ? "border-outline-variant/20 bg-surface-container-lowest"
                  : isCorrect
                    ? "border-primary/20 bg-primary/5"
                    : "border-error/20 bg-error-container/10",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
                    isUnanswered
                      ? "bg-surface-container text-secondary"
                      : isCorrect
                        ? "bg-primary text-white"
                        : "bg-error text-white",
                  )}
                >
                  {isUnanswered ? "—" : isCorrect ? "✓" : "✗"}
                </div>
                <p className="font-body text-on-surface font-medium leading-relaxed">
                  <span className="font-bold text-secondary mr-2">
                    Q{i + 1}.
                  </span>
                  {q.question}
                </p>
              </div>

              <div className="ml-10 space-y-1.5">
                {q.options.map((opt) => (
                  <div
                    key={opt}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-body",
                      opt === q.correctAnswer
                        ? "bg-primary/10 text-primary font-bold border border-primary/20"
                        : opt === state.selectedOption && !isCorrect
                          ? "bg-error/10 text-error border border-error/20"
                          : "text-on-surface-variant",
                    )}
                  >
                    {opt === q.correctAnswer && (
                      <span className="mr-1.5">✓</span>
                    )}
                    {opt === state.selectedOption && !isCorrect && (
                      <span className="mr-1.5">✗</span>
                    )}
                    {opt}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="ml-10 p-4 bg-surface-container rounded-xl border-l-2 border-primary/30">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  Explanation
                </p>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={onGoHome}
          className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-secondary hover:bg-surface-container transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-container rounded-xl p-3 text-center">
      <MaterialIcon
        name={icon}
        className="text-secondary text-base mx-auto mb-1"
      />
      <p className="text-[10px] text-secondary uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="font-headline font-bold text-sm text-on-surface">{value}</p>
    </div>
  );
}

function MiniBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-secondary">{label}</span>
        <span className="font-bold text-on-surface">
          {value} ({pct}%)
        </span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AccuracyRing({ accuracy }: { accuracy: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const filled = (accuracy / 100) * circ;

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="10"
          className="stroke-surface-container"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="10"
          stroke="var(--color-primary)"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-headline font-extrabold text-on-surface">
          {accuracy}%
        </span>
        <span className="text-[9px] text-secondary uppercase tracking-wider">
          accuracy
        </span>
      </div>
    </div>
  );
}
