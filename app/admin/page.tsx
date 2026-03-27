import Sidebar from "@/components/layout/sidebar";
import { MaterialIcon } from "@/components/ui/material-icon";

export default function AdminEditorPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Reusing our standard Left Navigation */}
      <Sidebar />

      {/* Central Editor Workspace */}
      <main className="flex-1 ml-64 mr-80 overflow-y-auto p-12 custom-scrollbar">
        <header className="mb-10">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            Create Assessment Item
          </h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase rounded-full tracking-widest">
              Draft Mode
            </span>
            <span className="text-secondary text-sm font-label">
              Last autosave: 2 minutes ago
            </span>
          </div>
        </header>

        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Question Prompt */}
          <div className="space-y-4">
            <label className="font-headline font-bold text-on-surface text-lg block">
              Question Prompt
            </label>
            <div className="bg-surface-container-lowest rounded-xl p-1 shadow-sm ring-1 ring-inset ring-outline-variant/30">
              <div className="flex gap-2 p-2 border-b border-surface-container">
                <button className="p-2 hover:bg-surface-container rounded transition-colors">
                  <MaterialIcon name="format_bold" className="text-xl" />
                </button>
                <button className="p-2 hover:bg-surface-container rounded transition-colors">
                  <MaterialIcon name="format_italic" className="text-xl" />
                </button>
                <button className="p-2 hover:bg-surface-container rounded transition-colors">
                  <MaterialIcon
                    name="format_list_bulleted"
                    className="text-xl"
                  />
                </button>
                <button className="p-2 hover:bg-surface-container rounded transition-colors ml-auto">
                  <MaterialIcon name="image" className="text-xl" />
                </button>
              </div>
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 p-6 min-h-[160px] text-lg leading-relaxed placeholder:text-outline/50 font-body text-on-surface outline-none resize-y"
                placeholder="Compose your complex academic question here..."
              />
            </div>
          </div>

          {/* Response Options */}
          <div className="space-y-6">
            <label className="font-headline font-bold text-on-surface text-lg block">
              Response Options
            </label>
            <div className="space-y-3">
              {["A", "B", "C", "D"].map((letter) => (
                <div
                  key={letter}
                  className="group flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-transparent hover:border-primary-fixed-dim transition-all"
                >
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="response"
                      type="radio"
                    />
                    <div className="w-10 h-10 rounded-full border-2 border-outline/30 flex items-center justify-center font-bold text-secondary peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all">
                      {letter}
                    </div>
                  </label>
                  <input
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none font-body text-on-surface"
                    placeholder={`Enter option ${letter} content...`}
                    type="text"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pedagogical Explanation */}
          <div className="space-y-4 pb-20">
            <label className="font-headline font-bold text-on-surface text-lg block">
              Pedagogical Rationale
            </label>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm ring-1 ring-inset ring-outline-variant/30 border-t-4 border-tertiary">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 p-0 min-h-[120px] outline-none text-on-surface-variant font-body leading-relaxed italic"
                placeholder="Explain the underlying concepts and why the correct answer is definitive..."
              />
            </div>
          </div>
        </div>
      </main>

      {/* Custom Right Sidebar for Admin Settings */}
      <aside className="w-80 fixed right-0 top-0 h-screen bg-surface-container-low border-l border-outline-variant/20 p-8 overflow-y-auto custom-scrollbar flex flex-col">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MaterialIcon name="category" className="text-primary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              Classification
            </h3>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-widest px-1">
                Subject Area
              </label>
              <div className="relative">
                <select className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm outline-none shadow-sm appearance-none">
                  <option>Rajasthan History</option>
                  <option>Indian Polity</option>
                  <option>Educational Psychology</option>
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="absolute right-3 top-2.5 pointer-events-none text-outline text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-widest px-1">
                Primary Topic
              </label>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm outline-none shadow-sm"
                placeholder="e.g. Mewar Dynasty"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-10 mt-10 border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <MaterialIcon name="auto_awesome" className="text-tertiary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              AI Generation Tool
            </h3>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-tertiary/10 p-5 rounded-xl space-y-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Generate a full assessment item including explanation based on the
              current subject and topic metadata.
            </p>
            <button className="w-full bg-primary hover:bg-blue-800 text-white py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
              <MaterialIcon name="rocket_launch" className="text-sm" />
              Generate Content
            </button>
          </div>
        </div>

        <div className="mt-auto pt-10">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold text-sm shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3">
            <MaterialIcon name="publish" />
            Publish to Orbit
          </button>
        </div>
      </aside>
    </div>
  );
}
