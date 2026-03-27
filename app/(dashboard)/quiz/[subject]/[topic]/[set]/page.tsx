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
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
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

  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : (params.subject ?? "");
  const topicSlug = Array.isArray(params.topic) ? params.topic[0] : (params.topic ?? "");
  const setSlug = Array.isArray(params.set) ? params.set[0] : (params.set ?? "");

  const progressKey = `quiz_progress_${subjectSlug}_${topicSlug}_${setSlug}`;
  const saveQuiz = useMutation(api.quizHistory.save);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [labels, setLabels] = useState({ subject: "", topic: "", set: "" });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // ── Load questions ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const all: QuizQuestion[] = JSON.parse(localStorage.getItem("quiz_questions") || "[]");

    const qs = all.filter(
      (q) => toSlug(q.subject) === subjectSlug && toSlug(q.topic) === topicSlug && toSlug(q.set) === setSlug
    );
    setQuestions(qs);

    if (qs.length > 0) {
      setLabels({ subject: qs[0].subject, topic: qs[0].topic, set: qs[0].set });
      // Rehydrate saved progress
      const saved: SavedProgress | null = JSON.parse(localStorage.getItem(progressKey) || "null");
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
    localStorage.setItem(progressKey, JSON.stringify({ current, answers, timeLeft }));
  }, [current, answers, timeLeft, isLoaded, questions.length, progressKey]);

  // ── Submit ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.answer) score++; });
    
    // Save to Convex
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
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
    sessionStorage.setItem("last_quiz_result", JSON.stringify({
      questions,
      answers,
      score,
      total: questions.length
    }));

    localStorage.removeItem(progressKey);
    router.push(
      `/quiz/result?subject=${encodeURIComponent(subjectSlug)}&topic=${encodeURIComponent(topicSlug)}&set=${encodeURIComponent(setSlug)}`
    );
  }, [answers, isSubmitting, questions, progressKey, router, subjectSlug, topicSlug, setSlug, labels, saveQuiz, timeLeft]);

  // ── Timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || questions.length === 0) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isLoaded, questions.length, timeLeft, handleSubmit]);

  // ── Derived ──────────────────────────────────────────────────────────
  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[current];
  const isLastQuestion = current === questions.length - 1;
  const timerDanger = timeLeft < 120;

  // ── Loading ───────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-4 animate-pulse">
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
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary mb-5 flex-wrap">
        <button onClick={() => router.push("/")} className="hover:text-on-surface transition-colors">Dashboard</button>
        <MaterialIcon name="chevron_right" className="text-sm text-outline" />
        <button onClick={() => router.push(`/quiz/${subjectSlug}`)} className="hover:text-on-surface transition-colors">{labels.subject}</button>
        <MaterialIcon name="chevron_right" className="text-sm text-outline" />
        <button onClick={() => router.push(`/quiz/${subjectSlug}/${topicSlug}`)} className="hover:text-on-surface transition-colors">{labels.topic}</button>
        <MaterialIcon name="chevron_right" className="text-sm text-outline" />
        <span className="text-on-surface font-medium font-mono">{labels.set}</span>
      </nav>

      {/* Header card */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/20 gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-0.5">{labels.topic}</p>
          <h1 className="text-lg font-mono font-extrabold text-primary">{labels.set}</h1>
        </div>
        <div className="flex items-center gap-5">
          {/* Timer */}
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-0.5">Time Left</span>
            <div className={cn("flex items-center gap-1.5 font-headline font-bold text-lg tabular-nums", timerDanger ? "text-error animate-pulse" : "text-on-surface")}>
              <MaterialIcon name="timer" className={cn("text-base", timerDanger && "text-error")} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant/30" />
          {/* Progress */}
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-0.5">Progress</span>
            <span className="font-headline font-bold text-lg text-on-surface">{current + 1} / {questions.length}</span>
          </div>
          <div className="h-8 w-px bg-outline-variant/30" />
          {/* Answered */}
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary mb-0.5">Answered</span>
            <span className="font-headline font-bold text-lg text-primary">{answeredCount}</span>
          </div>
          {/* Palette toggle */}
          <button
            onClick={() => setShowPalette((p) => !p)}
            title="Question Palette"
            className="ml-2 w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
          >
            <MaterialIcon name="grid_view" className="text-base text-secondary" />
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-8">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex gap-6">
        {/* Main area */}
        <div className="flex-1 min-w-0">
          {/* Question card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-lg shadow-primary/5 border border-primary/10 mb-6">
            <div className="flex items-start gap-3 mb-8">
              <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
                {current + 1}
              </span>
              <h2 className="text-xl font-body font-medium text-on-surface leading-relaxed">
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
                    onClick={() => setAnswers((prev) => ({ ...prev, [current]: option }))}
                    className={cn(
                      "group w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-surface-container hover:border-primary/40 hover:bg-surface-container/50"
                    )}
                  >
                    <span className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-headline font-bold text-sm transition-colors",
                      isSelected ? "bg-primary text-white" : "bg-surface-container-low text-secondary group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {letter}
                    </span>
                    <span className={cn("font-body text-sm leading-relaxed transition-colors", isSelected ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-on-surface")}>
                      {option}
                    </span>
                    {isSelected && <MaterialIcon name="check_circle" className="ml-auto text-primary text-lg shrink-0" />}
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

            {isLastQuestion ? (
              <button
                id="btn-submit"
                onClick={handleSubmit}
                disabled={answers[current] === undefined || isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                ) : (
                  <>Submit Quiz<MaterialIcon name="check_circle" className="text-lg" /></>
                )}
              </button>
            ) : (
              <button
                id="btn-next"
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                disabled={answers[current] === undefined}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next Question
                <MaterialIcon name="arrow_forward" className="text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Palette */}
        {showPalette && (
          <aside className="w-52 shrink-0 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-4 sticky top-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">Question Palette</p>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_, i) => {
                  const isAnswered = answers[i] !== undefined;
                  const isCurrent = i === current;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        isCurrent ? "bg-primary text-white ring-2 ring-primary/30 scale-110"
                          : isAnswered ? "bg-primary/15 text-primary hover:bg-primary/25"
                          : "bg-surface-container text-secondary hover:bg-surface-container-high"
                      )}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-secondary">
                  <span className="w-3 h-3 rounded bg-primary/15 shrink-0" />
                  Answered ({answeredCount})
                </div>
                <div className="flex items-center gap-2 text-[10px] text-secondary">
                  <span className="w-3 h-3 rounded bg-surface-container shrink-0" />
                  Not Answered ({questions.length - answeredCount})
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
