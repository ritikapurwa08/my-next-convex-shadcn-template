"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

function getTier(pct: number): { label: string; color: string; icon: string; message: string } {
  if (pct >= 80) return { label: "Excellent", color: "text-emerald-600", icon: "emoji_events", message: "Outstanding performance! You have mastered this set." };
  if (pct >= 60) return { label: "Good", color: "text-primary", icon: "thumb_up", message: "Great effort! A bit more revision and you'll ace it." };
  if (pct >= 40) return { label: "Average", color: "text-amber-600", icon: "trending_up", message: "You're on the right track. Keep practising regularly." };
  return { label: "Needs Improvement", color: "text-error", icon: "refresh", message: "Don't give up! Review the material and try again." };
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = Number(searchParams.get("score") ?? 0);
  const total = Number(searchParams.get("total") ?? 1);
  const subjectSlug = searchParams.get("subject") ?? "";
  const topicSlug = searchParams.get("topic") ?? "";
  const setSlug = searchParams.get("set") ?? "";

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const tier = getTier(pct);

  const [detailedResult, setDetailedResult] = useState<{
    questions: { question: string; answer: string; explanation?: string }[];
    answers: Record<number, string>;
  } | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("last_quiz_result");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setTimeout(() => setDetailedResult(parsed), 0);
      } catch {
        // ignore
      }
    }
  }, []);

  // Labels from slugs (best-effort)
  const subjectLabel = subjectSlug.replace(/-/g, " ");
  const topicLabel = topicSlug.replace(/-/g, " ");
  const setLabel = setSlug;

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const retryPath = subjectSlug && topicSlug && setSlug
    ? `/quiz/${subjectSlug}/${topicSlug}/${setSlug}`
    : subjectSlug ? `/quiz/${subjectSlug}` : "/";

  return (
    <div className="max-w-2xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Breadcrumb */}
      {subjectLabel && (
        <nav className="flex items-center gap-2 text-xs text-secondary mb-8 flex-wrap">
          <button onClick={() => router.push("/")} className="hover:text-on-surface transition-colors">Dashboard</button>
          <MaterialIcon name="chevron_right" className="text-sm text-outline" />
          <button onClick={() => router.push(`/quiz/${subjectSlug}`)} className="hover:text-on-surface transition-colors capitalize">{subjectLabel}</button>
          {topicLabel && (
            <>
              <MaterialIcon name="chevron_right" className="text-sm text-outline" />
              <button onClick={() => router.push(`/quiz/${subjectSlug}/${topicSlug}`)} className="hover:text-on-surface transition-colors capitalize">{topicLabel}</button>
            </>
          )}
          {setLabel && (
            <>
              <MaterialIcon name="chevron_right" className="text-sm text-outline" />
              <span className="text-on-surface font-medium font-mono">{setLabel}</span>
            </>
          )}
        </nav>
      )}

      {/* Badge */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container rounded-full text-[11px] font-bold uppercase tracking-widest text-secondary">
          <MaterialIcon name="assessment" className="text-sm" />
          Quiz Result
        </span>
        {setLabel && (
          <p className="mt-3 text-sm text-secondary font-mono">{setLabel}</p>
        )}
      </div>

      {/* Score card */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-xl shadow-primary/5 p-8 md:p-12 mb-6">
        {/* Circular gauge */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} fill="none" stroke="currentColor" className="text-surface-container" strokeWidth="12" />
              <circle
                cx="90" cy="90" r={radius} fill="none" stroke="currentColor"
                className={cn("transition-all duration-1000 ease-out",
                  pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-primary" : pct >= 40 ? "text-amber-500" : "text-error")}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-headline font-extrabold text-on-surface">{pct}%</span>
              <span className="text-xs text-secondary font-body mt-0.5">{score} / {total}</span>
            </div>
          </div>
        </div>

        {/* Tier */}
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full font-headline font-bold text-lg",
            pct >= 80 ? "bg-emerald-50 text-emerald-700" : pct >= 60 ? "bg-primary/10 text-primary" : pct >= 40 ? "bg-amber-50 text-amber-700" : "bg-error-container/30 text-error"
          )}>
            <MaterialIcon name={tier.icon} />
            {tier.label}
          </div>
          <p className="mt-3 text-sm text-secondary font-body max-w-sm mx-auto">{tier.message}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Correct", value: score, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Incorrect", value: total - score, icon: "cancel", color: "text-error", bg: "bg-error-container/20" },
            { label: "Total", value: total, icon: "quiz", color: "text-primary", bg: "bg-primary/5" },
          ].map((stat) => (
            <div key={stat.label} className={cn("rounded-2xl p-4 text-center", stat.bg)}>
              <MaterialIcon name={stat.icon} className={cn("text-2xl mb-1", stat.color)} />
              <p className="text-2xl font-headline font-extrabold text-on-surface">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <button
          id="btn-retry"
          onClick={() => router.push(retryPath)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-primary text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
        >
          <MaterialIcon name="refresh" className="text-lg" />
          Retry Quiz
        </button>
        <button
          id="btn-dashboard"
          onClick={() => router.push("/")}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border-2 border-outline-variant/30 text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container transition-colors"
        >
          <MaterialIcon name="dashboard" className="text-lg" />
          Back to Dashboard
        </button>
      </div>

      {/* Detailed Breakout */}
      {detailedResult && (
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-lg text-on-surface">Detailed Review</h3>
          {detailedResult.questions.map((q, i) => {
            const userAnswer = detailedResult.answers[i];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={i} className={cn("p-5 rounded-2xl border", isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-error-container/10 border-error/20")}>
                <div className="flex items-start gap-3">
                  <MaterialIcon 
                    name={isCorrect ? "check_circle" : "cancel"} 
                    className={cn("text-xl mt-0.5 shrink-0", isCorrect ? "text-emerald-500" : "text-error")} 
                  />
                  <div>
                    <p className="font-body font-medium text-sm text-on-surface leading-relaxed mb-3">
                      <span className="font-bold mr-2">{i + 1}.</span>{q.question}
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-secondary tracking-wide uppercase text-[10px] w-16">Your Answer:</span>
                        <span className={cn("font-semibold", isCorrect ? "text-emerald-700" : "text-error")}>
                          {userAnswer || "— Not Answered —"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-secondary tracking-wide uppercase text-[10px] w-16">Correct:</span>
                          <span className="text-emerald-700 font-semibold">{q.answer}</span>
                        </div>
                      )}
                    </div>
                    {q.explanation && (
                      <div className="mt-3 pt-3 border-t border-outline-variant/20">
                        <p className="text-xs text-secondary leading-relaxed"><span className="font-bold text-on-surface">Explanation: </span>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
