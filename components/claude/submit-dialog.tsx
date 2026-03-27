"use client";

import { MaterialIcon } from "@/components/ui/material-icon";
import { QuestionState } from "@/types/quiz";

interface SubmitDialogProps {
  questionStates: QuestionState[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitDialog({
  questionStates,
  onConfirm,
  onCancel,
}: SubmitDialogProps) {
  const answered = questionStates.filter((s) => s.status === "answered").length;
  const review = questionStates.filter((s) => s.status === "review").length;
  const skipped = questionStates.filter((s) => s.status === "skipped").length;
  const unvisited = questionStates.filter(
    (s) => s.status === "unvisited",
  ).length;
  const total = questionStates.length;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MaterialIcon
              name="assignment_turned_in"
              className="text-primary"
            />
          </div>
          <div>
            <h3 className="font-headline font-bold text-on-surface">
              Submit Quiz?
            </h3>
            <p className="text-xs text-secondary">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <SummaryItem
            label="Answered"
            value={answered}
            total={total}
            color="text-primary"
            bg="bg-primary/10"
          />
          <SummaryItem
            label="For Review"
            value={review}
            total={total}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <SummaryItem
            label="Skipped"
            value={skipped}
            total={total}
            color="text-secondary"
            bg="bg-surface-container"
          />
          <SummaryItem
            label="Unvisited"
            value={unvisited}
            total={total}
            color="text-on-surface-variant"
            bg="bg-surface-container"
          />
        </div>

        {unvisited + review > 0 && (
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <MaterialIcon
              name="warning"
              className="text-amber-600 text-base shrink-0 mt-0.5"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              You have {unvisited + review} unanswered or pending question
              {unvisited + review > 1 ? "s" : ""}. Are you sure you want to
              submit?
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-secondary hover:bg-surface-container transition-colors"
          >
            Continue Quiz
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  total,
  color,
  bg,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <p className={`text-xl font-headline font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-secondary uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
