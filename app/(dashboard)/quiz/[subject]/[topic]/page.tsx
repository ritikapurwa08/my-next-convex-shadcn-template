"use client";

import { useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  set: string;
  question: string;
}

function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function fromSlug(slug: string) {
  return slug.replace(/-/g, " ");
}

const emptySubscribe = () => () => {};

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const subjectSlug = Array.isArray(params.subject)
    ? params.subject[0]
    : (params.subject ?? "");
  const topicSlug = Array.isArray(params.topic)
    ? params.topic[0]
    : (params.topic ?? "");

  const isLoaded = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto py-6 space-y-4 animate-pulse">
        <div className="h-16 bg-surface-container rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const allQuestions: QuizQuestion[] =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("quiz_questions") || "[]")
      : [];

  const allSubjects = [...new Set(allQuestions.map((q) => q.subject))];
  const matchedSubject =
    allSubjects.find((s) => toSlug(s) === subjectSlug) ??
    allSubjects.find(
      (s) => s.toLowerCase() === fromSlug(subjectSlug).toLowerCase(),
    ) ??
    fromSlug(subjectSlug);

  const subjectQs = allQuestions.filter(
    (q) =>
      toSlug(q.subject) === subjectSlug ||
      q.subject.toLowerCase() === fromSlug(subjectSlug).toLowerCase(),
  );
  const allTopics = [...new Set(subjectQs.map((q) => q.topic))];
  const matchedTopic =
    allTopics.find((t) => toSlug(t) === topicSlug) ??
    allTopics.find(
      (t) => t.toLowerCase() === fromSlug(topicSlug).toLowerCase(),
    ) ??
    fromSlug(topicSlug);

  const topicQs = subjectQs.filter(
    (q) =>
      toSlug(q.topic) === topicSlug ||
      q.topic.toLowerCase() === fromSlug(topicSlug).toLowerCase(),
  );
  const setNames = [...new Set(topicQs.map((q) => q.set))];
  const computedSets = setNames.map((s) => ({
    name: s,
    questionCount: topicQs.filter((q) => q.set === s).length,
  }));

  const subjectLabel = matchedSubject;
  const topicLabel = matchedTopic;
  const sets = computedSets;

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-secondary mb-6"
        aria-label="breadcrumb"
      >
        <button
          onClick={() => router.push("/")}
          className="hover:text-on-surface transition-colors"
        >
          Dashboard
        </button>
        <MaterialIcon name="chevron_right" className="text-base text-outline" />
        <button
          onClick={() => router.push(`/quiz/${subjectSlug}`)}
          className="hover:text-on-surface transition-colors capitalize"
        >
          {subjectLabel}
        </button>
        <MaterialIcon name="chevron_right" className="text-base text-outline" />
        <span className="text-on-surface font-medium">{topicLabel}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-1 bg-secondary-container text-on-surface text-[10px] font-bold uppercase rounded-full tracking-widest">
            Topic
          </span>
        </div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">
          {topicLabel}
        </h1>
        <p className="text-secondary text-sm mt-1 capitalize">
          {subjectLabel} &rsaquo;{" "}
          {sets.length > 0
            ? `${sets.length} set${sets.length !== 1 ? "s" : ""} available — choose a set to start the quiz`
            : "No sets available yet"}
        </p>
      </header>

      {sets.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
            <MaterialIcon name="inbox" className="text-3xl text-secondary" />
          </div>
          <h2 className="text-lg font-headline font-bold text-on-surface mb-2">
            No Sets Yet
          </h2>
          <p className="text-secondary text-sm mb-6">
            No question sets have been uploaded for this topic.
          </p>
          <button
            onClick={() => router.push(`/quiz/${subjectSlug}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-outline-variant/30 text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container transition-colors"
          >
            <MaterialIcon name="arrow_back" className="text-base" />
            Back to Topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sets.map((s) => {
            const setSlug = toSlug(s.name);
            return (
              <div
                key={s.name}
                className="group relative bg-surface-container-lowest rounded-2xl border-2 border-surface-container hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <MaterialIcon name="assignment" className="text-xl" />
                  </div>

                  {/* Set name — font-mono only (not font-headline to avoid conflict) */}
                  <h3 className="font-mono font-bold text-on-surface text-lg mb-1">
                    {s.name}
                  </h3>
                  <p className="text-xs text-secondary mb-4 flex items-center gap-1.5">
                    <MaterialIcon name="quiz" className="text-sm" />
                    {s.questionCount} question{s.questionCount !== 1 ? "s" : ""}
                  </p>

                  <button
                    onClick={() =>
                      router.push(
                        `/quiz/${subjectSlug}/${topicSlug}/${setSlug}`,
                      )
                    }
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3 px-5",
                      "bg-primary text-white font-bold rounded-xl text-sm",
                      "hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all",
                    )}
                  >
                    Start Quiz
                    <MaterialIcon name="arrow_forward" className="text-base" />
                  </button>
                </div>

                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 text-[10px] text-secondary">
                    <MaterialIcon name="schedule" className="text-xs" />~
                    {Math.ceil(s.questionCount * 1.5)} min estimated
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
