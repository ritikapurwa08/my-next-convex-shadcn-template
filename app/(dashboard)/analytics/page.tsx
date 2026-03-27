import { MaterialIcon } from "@/components/ui/material-icon";

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold tracking-wider">
            REPORTS
          </span>
        </div>
        <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
          Academic Performance
        </h2>
        <p className="text-secondary font-body mt-2">
          Insights and growth metrics for the last 30 days.
        </p>
      </header>

      {/* Summary Stats Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border-t-2 border-primary">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MaterialIcon name="star" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Average Score
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline font-extrabold">88.4</span>
            <span className="text-xs font-bold text-primary">+4.2%</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border-t-2 border-primary-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary-container text-primary-container">
              <MaterialIcon name="emoji_events" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Best Subject
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">Indian Polity</span>
            <span className="text-[10px] font-medium text-secondary">
              Consecutive A+ grades
            </span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border-t-2 border-outline-variant">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-container text-on-surface-variant">
              <MaterialIcon name="history_edu" />
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
              Total Quizzes
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-headline font-extrabold">142</span>
            <span className="text-xs font-medium text-secondary">in 2026</span>
          </div>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Mastery Progress Bars (12 cols) */}
        <div className="col-span-1 lg:col-span-12 p-8 rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="font-headline font-bold text-lg">Topic Mastery</h3>
              <p className="text-secondary text-xs">
                Performance broken down by individual modules
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-surface-container rounded-lg text-xs font-bold text-on-surface">
                Last Month
              </button>
              <button className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold">
                All Time
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Rajasthan Geography</span>
                <span>92/100</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Indian Constitution</span>
                <span>78/100</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary opacity-80 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Educational Psychology</span>
                <span>65/100</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary-container rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Rajputana Dynasties</span>
                <span>42/100</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-error rounded-full opacity-70"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
