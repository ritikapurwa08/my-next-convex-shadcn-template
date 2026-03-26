export default function Sidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col py-8 px-4 gap-y-2 z-50">
      {/* Sidebar content will be injected here in Phase 2 */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-headline font-extrabold tracking-tight text-primary">
          The Exam Orbit
        </h1>
      </div>
    </aside>
  );
}
