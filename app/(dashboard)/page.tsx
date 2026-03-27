import { SubjectCard } from "@/components/dashboard/subject-card";

export default function DashboardPage() {
  const subjects = [
    {
      title: "Rajasthan History",
      icon: "history_edu",
    },
    {
      title: "Art & Culture",
      icon: "palette",
    },
    {
      title: "Rajasthan Geography",
      icon: "landscape",
    },
    {
      title: "Indian Polity",
      icon: "account_balance",
    },
    {
      title: "Indian Geography",
      icon: "map",
    },
    {
      title: "Psychology",
      icon: "psychology",
    },
  ];

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
      <section className="mt-12 overflow-hidden rounded-xl bg-primary relative h-48 flex items-center px-12">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none overflow-hidden">
          {/* Using a standard img tag here to avoid next/image domain config issues for now */}
          <img
            alt="Library Books"
            className="object-cover w-full h-full grayscale mix-blend-overlay"
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop"
          />
        </div>
        <div className="relative z-10 max-w-lg">
          <h4 className="text-2xl font-headline font-bold text-white mb-2">
            Mock Test Series 2024
          </h4>
          <p className="text-primary-fixed-dim text-sm font-label">
            Challenge yourself with timed simulated exams designed by academic
            experts.
          </p>
          <button className="mt-4 px-6 py-2 bg-white text-primary font-bold rounded-lg text-sm hover:bg-opacity-90 transition-all">
            Enroll Now
          </button>
        </div>
      </section>
    </>
  );
}
