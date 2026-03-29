"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  set: string;
  question: string;
  options: [string, string, string, string];
  answer: string;
  explanation?: string;
}

interface SavedProgress {
  current: number;
  answers: Record<number, string>;
  timeLeft: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const QUIZ_DURATION = 15 * 60; // 15 minutes

// ── Component ──────────────────────────────────────────────────────────────
export default function QuizSetPage() {
  const params = useParams();
  const router = useRouter();

  const subjectSlug = Array.isArray(params.subject)
    ? params.subject[0]
    : (params.subject ?? "");
  const topicSlug = Array.isArray(params.topic)
    ? params.topic[0]
    : (params.topic ?? "");
  const setSlug = Array.isArray(params.set)
    ? params.set[0]
    : (params.set ?? "");

  const progressKey = `quiz_progress_${subjectSlug}_${topicSlug}_${setSlug}`;
  const saveQuiz = useMutation(api.quizHistory.save);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [labels, setLabels] = useState({ subject: "", topic: "", set: "" });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Load questions ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const all: QuizQuestion[] = JSON.parse(
      localStorage.getItem("quiz_questions") || "[]",
    );

    const qs = all.filter(
      (q) =>
        toSlug(q.subject) === subjectSlug &&
        toSlug(q.topic) === topicSlug &&
        toSlug(q.set) === setSlug,
    );
    setQuestions(qs);

    if (qs.length > 0) {
      setLabels({ subject: qs[0].subject, topic: qs[0].topic, set: qs[0].set });
      // Rehydrate saved progress
      const saved: SavedProgress | null = JSON.parse(
        localStorage.getItem(progressKey) || "null",
      );
      if (saved) {
        setCurrent(saved.current);
        setAnswers(saved.answers);
        setTimeLeft(saved.timeLeft);
      }
    }
    setIsLoaded(true);
  }, [subjectSlug, topicSlug, setSlug, progressKey]);

  // ── Persist progress ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || questions.length === 0) return;
    localStorage.setItem(
      progressKey,
      JSON.stringify({ current, answers, timeLeft }),
    );
  }, [current, answers, timeLeft, isLoaded, questions.length, progressKey]);

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    // Save to Convex
    const accuracy =
      questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const timeTaken = QUIZ_DURATION - timeLeft;
    try {
      await saveQuiz({
        subject: labels.subject,
        topic: labels.topic,
        score,
        totalQuestions: questions.length,
        accuracy,
        timeTaken,
      });
    } catch (err) {
      console.error("Failed to save to history:", err);
    }

    // Save specific answers so the result page can render them
    sessionStorage.setItem(
      "last_quiz_result",
      JSON.stringify({
        questions,
        answers,
        score,
        total: questions.length,
      }),
    );

    localStorage.removeItem(progressKey);
    router.push(
      `/quiz/result?subject=${encodeURIComponent(subjectSlug)}&topic=${encodeURIComponent(topicSlug)}&set=${encodeURIComponent(setSlug)}&score=${score}&total=${questions.length}`,
    );
  }, [
    answers,
    isSubmitting,
    questions,
    progressKey,
    router,
    subjectSlug,
    topicSlug,
    setSlug,
    labels,
    saveQuiz,
    timeLeft,
  ]);

  // ── Timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isLoaded, questions.length, timeLeft, handleSubmit]);

  // ── Derived ──────────────────────────────────────────────────────────
  const progress = questions.length
    ? ((current + 1) / questions.length) * 100
    : 0;
  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[current];

  const timerDanger = timeLeft < 120;

  // ── Loading ───────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="w-full max-w-5xl 2xl:max-w-6xl py-6 space-y-4 animate-pulse">
        <div className="h-24 bg-surface-container rounded-2xl" />
        <div className="h-2 bg-surface-container rounded-full" />
        <div className="h-64 bg-surface-container rounded-3xl" />
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center mx-auto mb-6">
          <MaterialIcon name="quiz" className="text-4xl text-secondary" />
        </div>
        <h1 className="text-2xl font-headline font-bold text-on-surface mb-3">
          No Questions Found
        </h1>
        <p className="text-secondary text-sm mb-8">
          This set does not exist or has no questions.
        </p>
        <button
          onClick={() => router.push(`/quiz/${subjectSlug}/${topicSlug}`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
        >
          <MaterialIcon name="arrow_back" className="text-lg" />
          Back to Sets
        </button>
      </div>
    );
  }

  // ── Quiz UI ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="w-full max-w-5xl 2xl:max-w-6xl animate-in fade-in zoom-in-95 duration-500">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-secondary mb-8 flex-wrap">
          <button
            onClick={() => router.push("/")}
            className="hover:text-on-surface transition-colors"
          >
            Dashboard
          </button>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <button
            onClick={() => router.push(`/quiz/${subjectSlug}`)}
            className="hover:text-on-surface transition-colors"
          >
            {labels.subject}
          </button>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <button
            onClick={() => router.push(`/quiz/${subjectSlug}/${topicSlug}`)}
            className="hover:text-on-surface transition-colors"
          >
            {labels.topic}
          </button>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <span className="text-on-surface font-medium font-mono">
            {labels.set}
          </span>
        </nav>

        {/* Main area */}
        <div className="flex-1 min-w-0">
          {/* Question card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-lg shadow-primary/5 border border-primary/10 mb-6">
            <div className="flex items-start gap-3 mb-8">
              <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
                {current + 1}
              </span>
              <h2 className="text-xl font-hindi font-medium text-on-surface leading-relaxed">
                {currentQ.question}
              </h2>
            </div>
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[current] === option;
                const letter = ["A", "B", "C", "D"][idx];
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [current]: option }))
                    }
                    className={cn(
                      "group w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ease-in-out cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-surface-container hover:border-primary/40 hover:bg-surface-container/50",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-hindi font-bold text-sm transition-colors",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface-container-low text-secondary group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letter}
                    </span>
                    <span
                      className={cn(
                        "font-body text-sm leading-relaxed transition-colors",
                        isSelected
                          ? "text-primary "
                          : "text-on-surface-variant group-hover:text-on-surface",
                      )}
                    >
                      {option}
                    </span>
                    {isSelected && (
                      <MaterialIcon
                        name="check_circle"
                        className="ml-auto text-primary text-lg shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
            <button
              id="btn-previous"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-secondary hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <MaterialIcon name="arrow_back" className="text-lg" />
              Previous
            </button>

            <button
              id="btn-next"
              onClick={() =>
                setCurrent((c) => Math.min(questions.length - 1, c + 1))
              }
              disabled={current === questions.length - 1}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next Question
              <MaterialIcon name="arrow_forward" className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* NEW local right sidebar */}
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
                    timerDanger
                      ? "text-error animate-pulse"
                      : "text-on-surface",
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
                    / {questions.length}
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
              {questions.map((_, i) => {
                const isAnswered = answers[i] !== undefined;
                const isCurrent = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
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
          onClick={handleSubmit}
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
    </>
  );
}
