"use client";

import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

interface SubjectCardProps {
  title: string;
  icon: string;
}

export function SubjectCard({ title, icon }: SubjectCardProps) {
  const router = useRouter();

  const handleStartQuiz = () => {
    const slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    router.push(`/quiz/${slug}`);
  };

  return (
    <div className="group relative bg-surface-container-lowest p-8 rounded-xl transition-all duration-300 hover:translate-y-[-4px]">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
      <div className="relative">
        <div className="flex flex-row items-center  gap-x-2">
          <div className="size-10 min-h-10 min-w-10 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <MaterialIcon name={icon} className="text-3xl" />
          </div>

          <h3 className="text-lg items-center font-headline font-bold text-on-surface mb-2">
            {title}
          </h3>
        </div>
        <button
          onClick={handleStartQuiz}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-bold rounded-lg text-sm transition-all hover:shadow-[0_8px_20px_-4px_rgba(0,63,177,0.4)] active:scale-95"
        >
          Start Quiz
          <MaterialIcon name="arrow_forward" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
