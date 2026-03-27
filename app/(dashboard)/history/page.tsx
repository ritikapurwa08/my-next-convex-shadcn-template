import { MaterialIcon } from "@/components/ui/material-icon";

export default function HistoryPage() {
  // Mock data to keep the JSX clean and scalable
  const historyLogs = [
    {
      id: 1,
      subject: "Indian Polity",
      topic: "Constitutional Framework",
      score: "48/50",
      percentage: 96,
      date: "Today, 10:30 AM",
      status: "Excellent",
      icon: "account_balance",
      color: "primary",
    },
    {
      id: 2,
      subject: "Rajasthan Geography",
      topic: "Aravalli Range & Climate",
      score: "32/50",
      percentage: 64,
      date: "Yesterday, 4:15 PM",
      status: "Needs Review",
      icon: "landscape",
      color: "tertiary",
    },
    {
      id: 3,
      subject: "Rajasthan History",
      topic: "Mewar Dynasty",
      score: "45/50",
      percentage: 90,
      date: "Oct 12, 2023",
      status: "Good",
      icon: "history_edu",
      color: "secondary",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Filters */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
            Test History
          </h2>
          <p className="text-secondary font-body text-sm mt-2">
            Review your past performance and identify areas for improvement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body text-sm font-medium border border-outline-variant/20 hover:bg-surface-container transition-colors">
            <MaterialIcon name="filter_list" className="text-sm" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body text-sm font-medium border border-outline-variant/20 hover:bg-surface-container transition-colors">
            <MaterialIcon name="sort" className="text-sm" />
            <span>Subject A-Z</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content - History List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            Recent Assessments
          </h3>

          {historyLogs.map((log) => (
            <div
              key={log.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:shadow-lg hover:border-primary/20 transition-all duration-300 gap-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-${log.color}/10 flex items-center justify-center text-${log.color} shrink-0`}
                >
                  <MaterialIcon name={log.icon} className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface text-base">
                    {log.subject}
                  </h4>
                  <p className="text-xs text-secondary font-body mt-0.5">
                    {log.topic} • {log.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:justify-end">
                <div className="text-right">
                  <p className="font-headline font-extrabold text-lg text-on-surface">
                    {log.score}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${log.percentage >= 80 ? "text-primary" : log.percentage >= 60 ? "text-tertiary" : "text-error"}`}
                  >
                    {log.status}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MaterialIcon name="arrow_forward_ios" className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - AI Recommendations */}
        <div className="space-y-6">
          {/* Quick Insight Bento Card */}
          <div className="bg-primary rounded-2xl p-6 text-on-primary relative overflow-hidden group shadow-xl shadow-primary/10">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container opacity-20 rounded-full group-hover:scale-125 transition-transform duration-500"></div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <MaterialIcon
                name="tips_and_updates"
                className="text-tertiary-fixed"
              />
              <h4 className="font-headline font-bold text-sm">
                Focus Recommendation
              </h4>
            </div>

            <p className="font-body text-xs text-on-primary/90 leading-relaxed mb-6 relative z-10">
              Based on your history, you excel in Indian Polity but could spend
              more time reviewing unit 4 of Rajasthan Geography.
            </p>

            <button className="w-full py-3 bg-white text-primary font-bold text-xs rounded-xl active:scale-95 transition-transform relative z-10 hover:bg-opacity-90">
              Start Targeted Quiz
            </button>
          </div>

          {/* Info Alert */}
          <div className="p-4 bg-tertiary-container/10 rounded-xl border border-tertiary-container/20">
            <div className="flex gap-3 text-tertiary">
              <MaterialIcon name="info" className="text-lg shrink-0" />
              <p className="text-xs font-body leading-relaxed">
                <span className="font-bold">Did you know?</span> Reviewing
                marked questions within 24 hours increases retention by 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
