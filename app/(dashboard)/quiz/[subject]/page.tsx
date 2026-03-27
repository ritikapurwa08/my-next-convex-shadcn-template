"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  set: string;
  question: string;
  options: [string, string, string, string];
  answer: string;
}

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function fromSlug(slug: string) {
  return slug.replace(/-/g, " ");
}

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : (params.subject ?? "");

  const [topics, setTopics] = useState<{ name: string; setCount: number; questionCount: number }[]>([]);
  const [subjectLabel, setSubjectLabel] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const all: QuizQuestion[] = JSON.parse(localStorage.getItem("quiz_questions") || "[]");

    // Find matching subject by slug comparison
    const allSubjects = [...new Set(all.map((q) => q.subject))];
    const matchedSubject = allSubjects.find((s) => toSlug(s) === subjectSlug)
      ?? allSubjects.find((s) => s.toLowerCase() === fromSlug(subjectSlug).toLowerCase())
      ?? fromSlug(subjectSlug);

    setSubjectLabel(matchedSubject);

    const subjectQs = all.filter((q) => toSlug(q.subject) === subjectSlug || q.subject.toLowerCase() === fromSlug(subjectSlug).toLowerCase());
    const topicNames = [...new Set(subjectQs.map((q) => q.topic))];
    const topicData = topicNames.map((t) => {
      const tQs = subjectQs.filter((q) => q.topic === t);
      const sets = new Set(tQs.map((q) => q.set));
      return { name: t, setCount: sets.size, questionCount: tQs.length };
    });
    setTopics(topicData);
    setIsLoaded(true);
  }, [subjectSlug]);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-4 animate-pulse">
        <div className="h-16 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-surface-container rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <header className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:text-on-surface transition-colors mb-4"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase rounded-full tracking-widest">
            Subject
          </span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface capitalize">
          {subjectLabel}
        </h1>
        <p className="text-secondary text-sm mt-1">
          {topics.length > 0
            ? `${topics.length} topic${topics.length !== 1 ? "s" : ""} available — select a topic to browse sets`
            : "No topics available yet"}
        </p>
      </header>

      {topics.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center mx-auto mb-6">
            <MaterialIcon name="quiz" className="text-4xl text-secondary" />
          </div>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-3">No Questions Yet</h2>
          <p className="text-secondary text-sm mb-8">
            Ask an admin to upload questions for{" "}
            <span className="text-primary font-bold">{subjectLabel}</span>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
          >
            <MaterialIcon name="arrow_back" className="text-lg" />
            Back to Dashboard
          </button>
        </div>
      ) : (
        /* Topic grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => {
            const topicSlug = toSlug(t.name);
            return (
              <button
                key={t.name}
                onClick={() => router.push(`/quiz/${subjectSlug}/${topicSlug}`)}
                className={cn(
                  "group relative text-left bg-surface-container-lowest rounded-2xl p-6 border-2 border-surface-container",
                  "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
                <div className="relative">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <MaterialIcon name="menu_book" className="text-xl" />
                  </div>
                  {/* Topic name */}
                  <h3 className="font-headline font-bold text-on-surface text-base mb-2 group-hover:text-primary transition-colors">
                    {t.name}
                  </h3>
                  {/* Meta */}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <MaterialIcon name="layers" className="text-sm" />
                      {t.setCount} set{t.setCount !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <MaterialIcon name="quiz" className="text-sm" />
                      {t.questionCount} Q
                    </span>
                  </div>
                  {/* Arrow */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View Sets
                    <MaterialIcon name="arrow_forward" className="text-sm" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
