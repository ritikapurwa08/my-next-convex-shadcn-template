"use client";

import { useEffect, useRef } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  timeLeft: number;
  onTick: () => void;
  isRunning: boolean;
}

export function QuizTimer({ timeLeft, onTick, isRunning }: QuizTimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(onTick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft <= 120;

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-headline font-bold text-lg transition-colors",
        isUrgent ? "text-error animate-pulse" : "text-on-surface",
      )}
    >
      <MaterialIcon name="timer" className="text-xl" />
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
