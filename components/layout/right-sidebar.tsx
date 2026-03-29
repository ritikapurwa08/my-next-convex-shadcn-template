import { MaterialIcon } from "@/components/ui/material-icon";
import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface RightSidebarProps {
  children?: React.ReactNode;
}

export default function RightSidebar({ children }: RightSidebarProps) {
  const pathname = usePathname();
  const isHistory = pathname === "/history";
  // We can just call it unconditionally; if it's not history, it just caches it (or we could make a separate component, but this is fine)
  const stats = useQuery(api.quizHistory.stats);

  return (
    <aside className="w-80 h-screen fixed right-0 top-0 bg-surface-container-low border-l-0 p-8 flex flex-col gap-y-8 overflow-y-auto">
      {children ? children : (
        <>
          {isHistory ? (
            <section>
              <h4 className="flex items-center gap-2 text-xs font-label font-bold text-secondary uppercase tracking-[0.15em] mb-6">
                <MaterialIcon name="analytics" className="text-secondary" />
                Overall Statistics
              </h4>
              <div className="space-y-4">
                <StatCard icon="quiz" label="Total Quizzes" value={String(stats?.totalQuizzes ?? 0)} />
                <StatCard icon="percent" label="Avg Accuracy" value={`${stats?.avgAccuracy ?? 0}%`} />
                <StatCard icon="star" label="Best Subject" value={stats?.bestSubject ?? "-"} small />
              </div>
            </section>
          ) : (
            <>
            <section>
              <h4 className="text-xs font-label font-bold text-secondary uppercase tracking-[0.15em] mb-6">
                Quick Stats
              </h4>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                  Weekly Mastery
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-headline font-extrabold text-on-surface">
                    84%
                  </span>
                  <span className="text-xs text-primary font-bold">
                    +12% vs last week
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container mt-3 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-tertiary">
                <p className="text-[10px] text-secondary font-bold uppercase tracking-wider mb-1">
                  Quizzes Completed
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-headline font-extrabold text-on-surface">
                    142
                  </span>
                  <span className="text-xs text-secondary">Level 12 Scholar</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xs font-label font-bold text-secondary uppercase tracking-[0.15em]">
                Recent Activity
              </h4>
              <button className="text-[10px] font-bold text-primary hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MaterialIcon name="check_circle" className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    Completed: Indian Polity
                  </p>
                  <p className="text-[10px] text-secondary mt-1">
                    Score: 48/50 • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                  <MaterialIcon name="bookmark" className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    Marked for Review
                  </p>
                  <p className="text-[10px] text-secondary mt-1">
                    Rajasthan Geography • Unit 4
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <MaterialIcon name="emoji_events" className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    New Badge Unlocked
                  </p>
                  <p className="text-[10px] text-secondary mt-1">
                    Consistent Learner • 7 Day Streak
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Calendar/Engagement Mockup */}
          <section className="mt-auto">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <p className="text-xs font-bold text-primary mb-2 text-center">
                Study Streak
              </p>
              <div className="flex justify-between items-center gap-1">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    M
                  </span>
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    T
                  </span>
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    W
                  </span>
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    T
                  </span>
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    F
                  </span>
                  <div className="w-6 h-6 rounded-md bg-primary"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    S
                  </span>
                  <div className="w-6 h-6 rounded-md bg-surface-container"></div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-bold text-secondary uppercase">
                    S
                  </span>
                  <div className="w-6 h-6 rounded-md bg-surface-container"></div>
                </div>
              </div>
              <p className="text-[10px] text-secondary mt-4 text-center italic">
                &quot;Consistency is the key to mastery.&quot;
              </p>
            </div>
          </section>
          </>
          )}
        </>
      )}
    </aside>
  );
}

function StatCard({
  icon,
  label,
  value,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <MaterialIcon name={icon} className="text-base" />
        </div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "font-headline font-extrabold text-on-surface",
          small ? "text-base" : "text-3xl",
        )}
      >
        {value}
      </p>
    </div>
  );
}
