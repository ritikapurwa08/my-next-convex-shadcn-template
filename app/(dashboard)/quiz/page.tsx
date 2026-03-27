import { MaterialIcon } from "@/components/ui/material-icon";

export default function QuizPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Quiz Header / Progress */}
      <header className="flex items-center justify-between mb-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
        <div>
          <h1 className="text-xl font-headline font-extrabold text-primary">
            Indian Polity Assessment
          </h1>
          <p className="text-sm text-secondary font-body mt-1">
            Topic: Constitutional Framework
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Time Remaining
            </span>
            <div className="flex items-center gap-2 text-error font-headline font-bold text-lg">
              <MaterialIcon name="timer" />
              14:23
            </div>
          </div>

          <div className="h-10 w-px bg-outline-variant/30"></div>

          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
              Progress
            </span>
            <span className="font-headline font-bold text-lg text-on-surface">
              Question 4 / 20
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-12">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: "20%" }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-lg shadow-primary/5 border border-primary/10 mb-8">
        <h2 className="text-2xl font-body font-medium text-on-surface leading-relaxed mb-10">
          Which of the following schedules of the Indian Constitution contains
          provisions regarding anti-defection?
        </h2>

        <div className="space-y-4">
          {/* Options */}
          {[
            "Second Schedule",
            "Fifth Schedule",
            "Eighth Schedule",
            "Tenth Schedule",
          ].map((option, index) => (
            <label
              key={index}
              className="group relative flex items-center gap-4 p-5 rounded-xl border-2 border-surface-container hover:border-primary cursor-pointer transition-all"
            >
              <input type="radio" name="quiz_answer" className="peer sr-only" />
              <div className="w-6 h-6 rounded-full border-2 border-outline flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
                <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-body text-base text-on-surface-variant group-hover:text-on-surface peer-checked:text-primary peer-checked:font-bold transition-colors">
                {option}
              </span>

              {/* Highlight Background on Checked */}
              <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-secondary hover:bg-surface-container transition-colors">
          <MaterialIcon name="arrow_back" className="text-lg" />
          Previous
        </button>

        <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all">
          Next Question
          <MaterialIcon name="arrow_forward" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
