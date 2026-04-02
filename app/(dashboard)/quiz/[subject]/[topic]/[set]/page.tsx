"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MaterialIcon } from "@/components/ui/material-icon";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizSidebar } from "@/components/quiz/quiz-sidebar";

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
          <QuestionCard
            currentQ={currentQ}
            current={current}
            answer={answers[current]}
            onAnswerSelect={(cur, option) =>
              setAnswers((prev) => ({ ...prev, [cur]: option }))
            }
          />

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

      <QuizSidebar
        labels={labels}
        timeLeft={timeLeft}
        timerDanger={timerDanger}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        progress={progress}
        current={current}
        onPageChange={setCurrent}
        answers={answers}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </>
  );
}
