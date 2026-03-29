"use client";

import { useEffect, useState } from "react";
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

export default function StoredQuestionsPage() {
  const [stored, setStored] = useState<QuizQuestion[]>([]);
  const [viewSubject, setViewSubject] = useState("__ALL__");
  const [viewTopic, setViewTopic] = useState("__ALL__");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // ── Load from localStorage ───────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedStr = localStorage.getItem("quiz_questions");
        if (storedStr) {
          // Wrap in setTimeout to avoid the "synchronous setState in effect" lint warning
          setTimeout(() => {
            setStored(JSON.parse(storedStr));
          }, 0);
        }
      } catch (e) {
        console.error("Failed to parse stored questions", e);
      }
    }
  }, []);

  // ── Delete ───────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    const updated = stored.filter((q) => q.id !== id);
    localStorage.setItem("quiz_questions", JSON.stringify(updated));
    setStored(updated); 
    setDeleteConfirm(null);
  };

  // ── Derived ──────────────────────────────────────────────────────────
  const filteredStored = stored.filter((q) => {
    if (viewSubject !== "__ALL__" && q.subject !== viewSubject) return false;
    if (viewTopic !== "__ALL__" && q.topic !== viewTopic) return false;
    return true;
  });

  // Unique subjects/topics in stored
  const storedSubjects = [...new Set(stored.map((q) => q.subject))];
  const storedTopicsForSubject = viewSubject === "__ALL__"
    ? [...new Set(stored.map((q) => q.topic))]
    : [...new Set(stored.filter((q) => q.subject === viewSubject).map((q) => q.topic))];

  // Group by set for current view
  const grouped: Record<string, QuizQuestion[]> = {};
  for (const q of filteredStored) {
    const key = `${q.subject} › ${q.topic} › ${q.set}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(q);
  }

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase rounded-full tracking-widest">
            Admin
          </span>
          <span className="text-secondary text-xs">Content Management</span>
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
          Stored Questions
        </h1>
        <p className="text-sm text-secondary mt-1">
          Review and manage all locally stored quiz questions by Subject and Topic.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MaterialIcon name="list_alt" className="text-primary text-xl" />
          <h2 className="font-headline font-bold text-on-surface text-lg">
            All Sets
          </h2>
          <span className="text-sm text-secondary ml-1">({stored.length} total)</span>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setViewSubject("__ALL__"); setViewTopic("__ALL__"); }}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all",
              viewSubject === "__ALL__" ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface-container text-secondary hover:bg-surface-container-high")}
          >
            All Subjects ({stored.length})
          </button>
          {storedSubjects.map((s) => (
            <button key={s} onClick={() => { setViewSubject(s); setViewTopic("__ALL__"); }}
              className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all",
                viewSubject === s ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface-container text-secondary hover:bg-surface-container-high")}
            >
              {s} ({stored.filter((q) => q.subject === s).length})
            </button>
          ))}
        </div>

        {/* Topic filter */}
        {viewSubject !== "__ALL__" && storedTopicsForSubject.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-primary/20">
            <button
              onClick={() => setViewTopic("__ALL__")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewTopic === "__ALL__" ? "bg-secondary-container text-on-surface" : "bg-surface-container text-secondary hover:bg-surface-container-high")}
            >
              All Topics
            </button>
            {storedTopicsForSubject.map((t) => (
              <button key={t} onClick={() => setViewTopic(t)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  viewTopic === t ? "bg-secondary-container text-on-surface" : "bg-surface-container text-secondary hover:bg-surface-container-high")}
              >
                {t} ({stored.filter((q) => q.subject === viewSubject && q.topic === t).length})
              </button>
            ))}
          </div>
        )}

        {/* Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-secondary bg-surface-container-lowest border border-outline-variant/20 rounded-3xl">
            <MaterialIcon name="inbox" className="text-5xl text-outline mb-4" />
            <p className="font-headline font-bold text-on-surface text-lg">No questions found</p>
            <p className="text-sm mt-1">Try to upload some in the Quiz Questions tab.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([groupKey, questions]) => {
              const [, gTopic, gSet] = groupKey.split(" › ");
              return (
                <div key={groupKey} className="rounded-3xl border border-outline-variant/20 overflow-hidden bg-surface-container-lowest shadow-sm">
                  {/* Group header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-surface-container/50 border-b border-outline-variant/10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">{gTopic}</span>
                      <MaterialIcon name="chevron_right" className="text-sm text-outline" />
                      <span className="text-base font-headline font-extrabold text-on-surface">{gSet}</span>
                      <span className="ml-2 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/10">
                        {questions.length} Questions
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = stored.filter((q) => !(q.topic === gTopic && q.set === gSet));
                        localStorage.setItem("quiz_questions", JSON.stringify(updated));
                        setStored(updated);
                      }}
                      className="flex items-center gap-1.5 text-xs text-error font-bold hover:bg-error-container/40 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <MaterialIcon name="delete_sweep" className="text-sm" />
                      Clear Set
                    </button>
                  </div>
                  {/* Questions */}
                  <div className="divide-y divide-outline-variant/10">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="group relative flex items-start gap-4 p-5 hover:bg-surface-container/30 transition-colors pr-14">
                        <span className="shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-[11px] font-bold text-secondary shadow-inner">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-medium text-on-surface leading-relaxed mb-3">
                            {q.question}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Answer:</span>
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">{q.answer}</span>
                          </div>
                          {q.explanation && (
                            <p className="mt-2 text-[11px] text-secondary leading-relaxed bg-surface-container-low p-2 rounded-lg italic">
                              <span className="font-bold text-on-surface-variant not-italic mr-1">Explanation:</span>
                              {q.explanation}
                            </p>
                          )}
                        </div>
                        {/* Delete */}
                        {deleteConfirm === q.id ? (
                          <div className="absolute top-4 right-4 flex gap-1.5 bg-surface-container p-1 rounded-xl shadow-md border border-outline-variant/10 z-10">
                            <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 bg-error text-white text-[10px] font-bold rounded-lg hover:bg-error/90 transition-colors">Confirm</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-surface-container-high text-on-surface text-[10px] font-bold rounded-lg hover:bg-outline-variant/20 transition-colors">Cancel</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(q.id)}
                            className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-outline hover:text-error hover:bg-error-container hover:shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            aria-label="Delete question"
                          >
                            <MaterialIcon name="delete" className="text-sm" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
