"use client";

import { useEffect, useState } from "react";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { PromoBanner } from "@/components/dashboard/promo-banner";

const defaultSubjects = [
  { title: "Rajasthan History", icon: "history_edu" },
  { title: "Art & Culture", icon: "palette" },
  { title: "Rajasthan Geography", icon: "landscape" },
  { title: "Indian Polity", icon: "account_balance" },
  { title: "Indian Geography", icon: "map" },
  { title: "Psychology", icon: "psychology" },
];

export default function DashboardPage() {
  const [subjects, setSubjects] =
    useState<{ title: string; icon: string }[]>(defaultSubjects);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const allStr = localStorage.getItem("quiz_questions") || "[]";
        const all = JSON.parse(allStr);
        const storedSubjects = [
          ...new Set(all.map((q: { subject: string }) => q.subject)),
        ] as string[];
        const newSubjects = storedSubjects.filter(
          (s: string) =>
            !defaultSubjects.some(
              (d) => d.title.toLowerCase() === s.toLowerCase(),
            ),
        );

        if (newSubjects.length > 0) {
          const dynamicCards = newSubjects.map((s: string) => ({
            title: s,
            icon: "folder", // Default icon for custom subjects
          }));
          setTimeout(
            () => setSubjects([...defaultSubjects, ...dynamicCards]),
            0,
          );
        }
      } catch (e) {
        console.error("Failed to parse custom subjects", e);
      }
    }
  }, []);

  return (
    <>
      {/* Header Section */}
      <header className="mb-12">
        <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
          Academic Dashboard
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
          <p className="text-secondary font-label text-sm uppercase tracking-widest">
            Select your specialization
          </p>
        </div>
      </header>

      {/* Subject Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.title}
            title={subject.title}
            icon={subject.icon}
          />
        ))}
      </div>

      {/* Promotion Banner */}
      <PromoBanner />
    </>
  );
}
