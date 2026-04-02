import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  currentQ: {
    question: string;
    options: string[];
  };
  current: number;
  answer?: string;
  onAnswerSelect: (current: number, option: string) => void;
}

export function QuestionCard({
  currentQ,
  current,
  answer,
  onAnswerSelect,
}: QuestionCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-lg shadow-primary/5 border border-primary/10 mb-6">
      <div className="flex items-start gap-3 mb-8">
        <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-headline font-bold text-sm">
          {current + 1}
        </span>
        <h2 className="text-2xl font-hindi font-medium text-on-surface leading-relaxed">
          {currentQ.question}
        </h2>
      </div>
      <div className="space-y-3">
        {currentQ.options.map((option, idx) => {
          const isSelected = answer === option;
          const letter = ["A", "B", "C", "D"][idx];
          return (
            <button
              key={idx}
              onClick={() => onAnswerSelect(current, option)}
              className={cn(
                "group w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ease-in-out cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-surface-container hover:border-primary/40 hover:bg-surface-container/50",
              )}
            >
              <span
                className={cn(
                  "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-poppins font-bold text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-surface-container-low text-secondary group-hover:bg-primary/10 group-hover:text-primary",
                )}
              >
                {letter}
              </span>
              <span
                className={cn(
                  "font-hindi text-xl font-medium leading-relaxed transition-colors",
                  isSelected
                    ? "text-primary"
                    : "text-on-surface-variant group-hover:text-on-surface",
                )}
              >
                {option}
              </span>
              {isSelected && (
                <MaterialIcon
                  name="check_circle"
                  className="ml-auto text-primary text-lg shrink-0"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
