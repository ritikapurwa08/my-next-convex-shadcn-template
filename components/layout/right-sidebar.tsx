export default function RightSidebar() {
  return (
    <aside className="w-80 h-screen fixed right-0 top-0 bg-surface-container-low border-l-0 p-8 flex flex-col gap-y-8 overflow-y-auto">
      {/* Quick stats and streak calendar will be injected here in Phase 2 */}
      <h4 className="text-xs font-label font-bold text-secondary uppercase tracking-[0.15em] mb-6">
        Quick Stats
      </h4>
    </aside>
  );
}
