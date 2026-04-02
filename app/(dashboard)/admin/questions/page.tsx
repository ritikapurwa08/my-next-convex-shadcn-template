"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";
import { SelectOrAdd } from "@/components/admin/select-or-add";
import { AiPromptSection } from "@/components/admin/ai-prompt-section";
import { validateInput, RawInputQuestion } from "@/lib/quiz-validation";

// ── Types ──────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: string;
  subject: string;
  topic: string;
  set: string;
  question: string;
  options: [string, string, string, string];
  answer: string;
  explanation?: string;
}

// RawInputQuestion is imported from @/lib/quiz-validation

// ── Default data ───────────────────────────────────────────────────────────
const DEFAULT_SUBJECTS = [
  "Rajasthan History",
  "Art & Culture",
  "Rajasthan Geography",
  "Indian Polity",
  "Indian Geography",
  "Psychology",
];

const DEFAULT_TOPIC_MAP: Record<string, string[]> = {
  "Rajasthan History": [
    "Chauhan Dynasty",
    "Mewar Dynasty",
    "Marwar",
    "Modern Rajasthan",
  ],
  "Art & Culture": ["Folk Music", "Handicrafts", "Festivals", "Architecture"],
  "Rajasthan Geography": ["Aravalli Range", "Thar Desert", "Rivers", "Climate"],
  "Indian Polity": [
    "Constitutional Framework",
    "Fundamental Rights",
    "DPSP",
    "Parliament",
  ],
  "Indian Geography": [
    "Himalayan System",
    "Peninsular Rivers",
    "Climate Zones",
    "Soils",
  ],
  Psychology: [
    "Cognitive Development",
    "Learning Theories",
    "Motivation",
    "Assessment",
  ],
};

const SAMPLE_JSON = `[
  {
    "id": "q001",
    "question": "Which of the following was the capital of the Chauhan dynasty?",
    "options": ["Ajmer", "Jaisalmer", "Udaipur", "Bikaner"],
    "correctAnswer": "Ajmer",
    "explanation": "Ajmer was the primary capital of the Chauhan (Chahamana) dynasty, founded by Ajayaraja II in the 12th century."
  },
  {
    "id": "q002",
    "question": "Prithviraj Chauhan was defeated in the Second Battle of Tarain in which year?",
    "options": ["1191 AD", "1192 AD", "1194 AD", "1206 AD"],
    "correctAnswer": "1192 AD",
    "explanation": "In 1192 AD, Muhammad of Ghor defeated Prithviraj Chauhan in the Second Battle of Tarain, ending Chauhan rule."
  }
]`;

// ── Helpers ────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function QuestionsAdminPage() {
  // ── Classification state ─────────────────────────────────────────────
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [topicMap, setTopicMap] =
    useState<Record<string, string[]>>(DEFAULT_TOPIC_MAP);
  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0]);
  const [topic, setTopic] = useState(DEFAULT_TOPIC_MAP[DEFAULT_SUBJECTS[0]][0]);
  const [setName, setSetName] = useState("");

  // ── JSON editor state ────────────────────────────────────────────────
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [validatedCount, setValidatedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  // ── Subject change ───────────────────────────────────────────────────
  const handleSubjectChange = (s: string) => {
    setSubject(s);
    const topics = topicMap[s] ?? [];
    setTopic(topics[0] ?? "");
    setParseSuccess(false);
    setParseError("");
    setSaveMsg(null);
  };

  const handleAddSubject = (s: string) => {
    setSubjects((p) => [...p, s]);
    setTopicMap((p) => ({ ...p, [s]: [] }));
    setSubject(s);
    setTopic("");
  };

  // ── Topic change ─────────────────────────────────────────────────────
  const handleAddTopic = (t: string) => {
    setTopicMap((p) => ({ ...p, [subject]: [...(p[subject] ?? []), t] }));
    setTopic(t);
  };

  // ── Save (Validate & Save) ───────────────────────────────────────────
  const handleSave = async () => {
    setParseError("");
    setParseSuccess(false);
    setSaveMsg(null);
    if (!setName.trim()) {
      setParseError("Set Name is required before saving.");
      return;
    }

    let parsed: RawInputQuestion[];
    try {
      const parsedJson = JSON.parse(jsonInput);
      const result = validateInput(parsedJson);
      if (!result.valid) {
        setParseError(result.error);
        return;
      }
      parsed = result.questions;
      setParseSuccess(true);
      setValidatedCount(parsed.length);
    } catch (e) {
      setParseError(`Invalid JSON: ${(e as Error).message}`);
      return;
    }

    setSaving(true);
    try {
      const withMeta: QuizQuestion[] = parsed.map((q) => ({
        id: q.id ?? crypto.randomUUID(),
        subject,
        topic,
        set: setName.trim(),
        question: q.question,
        options: q.options as [string, string, string, string],
        answer: (q.correctAnswer ?? q.answer) as string,
        explanation: q.explanation || "No explanation provided.",
      }));

      // 1. Save locally via API (to your data/ folder)
      const res = await fetch("/api/save-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: toSlug(subject),
          topic: toSlug(topic) || "topic",
          setName: toSlug(setName.trim()),
          questions: withMeta.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.answer,
            explanation: q.explanation,
          })),
        }),
      });

      const apiData = await res.json();
      if (!res.ok) throw new Error(apiData.error || "Local API save failed");

      // 2. Save directly to localStorage so they appear on the Dashboard
      try {
        const existing = JSON.parse(localStorage.getItem("quiz_questions") || "[]");
        const updated = [...existing, ...withMeta];
        localStorage.setItem("quiz_questions", JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage save failed", e);
      }

      setSaveMsg({
        type: "ok",
        text: `✓ ${withMeta.length} question(s) saved to localStorage and local data folder.`,
      });
      setJsonInput("");
      setParseSuccess(false);
      setSetName("");
    } catch (e) {
      setSaveMsg({
        type: "error",
        text: (e as Error).message || "Failed to save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────
  const previewPath = `questions/${toSlug(subject)}/${toSlug(topic || "topic")}/${setName.trim().replace(/\s+/g, "-") || "<set-name>"}`;

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-2rem)] gap-0 -m-10">
      {/* ── Main Editor ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-10 pr-6">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase rounded-full tracking-widest">
              Admin
            </span>
            <span className="text-secondary text-xs">Content Management</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
            Upload Questions
          </h1>
          <p className="text-sm text-secondary mt-1">
            Subject / Topic / Set चुनें, JSON paste करें, validate करें और
            localStorage में save करें।
          </p>
        </header>

        {/* JSON Paste Area */}
        <div className="w-full max-w-5xl 2xl:max-w-7xl space-y-8">
          <section className="space-y-3">
            {/* Textarea */}
            <div
              className={cn(
                "rounded-xl ring-1 ring-inset overflow-hidden",
                parseError
                  ? "ring-error/50"
                  : parseSuccess
                    ? "ring-primary/40"
                    : "ring-outline-variant/30",
              )}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-surface-container text-[11px] text-secondary border-b border-outline-variant/10">
                <span className="font-mono">questions.json</span>
                <span>{jsonInput ? `${jsonInput.length} chars` : "empty"}</span>
              </div>
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setParseSuccess(false);
                  setParseError("");
                  setSaveMsg(null);
                }}
                placeholder={SAMPLE_JSON}
                className="w-full bg-surface-container-lowest border-none outline-none p-5 min-h-[260px] text-sm font-mono text-on-surface resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Feedback */}
            {parseError && (
              <div className="flex items-start gap-2 p-3 bg-error-container/20 border border-error/20 rounded-xl text-sm text-error">
                <MaterialIcon
                  name="error"
                  className="text-base shrink-0 mt-0.5"
                />
                <span>{parseError}</span>
              </div>
            )}
            {parseSuccess && !saveMsg && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary">
                <MaterialIcon name="check_circle" className="text-base" />
                <span>
                  JSON valid &mdash; {validatedCount} question
                  {validatedCount !== 1 ? "s" : ""} ready to save to &ldquo;
                  {subject} &rsaquo; {topic} &rsaquo; {setName}&rdquo;
                </span>
              </div>
            )}
            {saveMsg && (
              <div
                className={cn(
                  "flex items-start gap-2 p-3 rounded-xl text-sm border",
                  saveMsg.type === "ok"
                    ? "bg-primary/5 border-primary/20 text-primary"
                    : "bg-error-container/20 border-error/20 text-error",
                )}
              >
                <MaterialIcon
                  name={saveMsg.type === "ok" ? "check_circle" : "error"}
                  className="text-base shrink-0 mt-0.5"
                />
                <span>{saveMsg.text}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {jsonInput && (
                <button
                  onClick={() => {
                    setJsonInput("");
                    setParseSuccess(false);
                    setParseError("");
                    setSaveMsg(null);
                  }}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-secondary hover:bg-surface-container transition-colors"
                >
                  <MaterialIcon name="close" className="text-base" />
                  Clear JSON
                </button>
              )}
            </div>
          </section>

          {/* ── AI Prompt Generator ── */}
          <AiPromptSection subject={subject} topic={topic} />
        </div>
      </main>

      {/* ── Right Classification Panel ── */}
      <aside className="w-72 shrink-0 border-l border-outline-variant/20 bg-surface-container-low p-7 flex flex-col gap-6 overflow-y-auto sticky top-0 h-screen">
        <div className="flex items-center gap-2">
          <MaterialIcon name="category" className="text-primary" />
          <h2 className="font-headline font-bold text-on-surface text-base">
            Classification
          </h2>
        </div>

        {/* Subject */}
        <SelectOrAdd
          label="Subject"
          value={subject}
          options={subjects}
          onChange={handleSubjectChange}
          onAddNew={handleAddSubject}
          placeholder="e.g. Modern History"
        />

        {/* Topic */}
        <SelectOrAdd
          label="Topic"
          value={topic}
          options={topicMap[subject] ?? []}
          onChange={setTopic}
          onAddNew={handleAddTopic}
          placeholder="e.g. Mughal Empire"
          disabled={(topicMap[subject] ?? []).length === 0 && !topic}
        />

        {/* Set Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
            Set Name
          </label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="e.g. Chauhan-Dynasty-Part-1"
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none text-on-surface focus:border-primary/40 transition-colors font-mono"
          />
          <p className="text-[10px] text-secondary">
            Spaces की जगह hyphen (-) use करें।
          </p>
        </div>

        {/* Path preview */}
        <div className="p-3 bg-surface-container rounded-xl">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
            Key Preview
          </p>
          <p className="text-xs font-mono text-on-surface-variant break-all leading-relaxed">
            {previewPath}
          </p>
        </div>

        {/* Save button */}
        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          <button
            onClick={handleSave}
            disabled={saving || !jsonInput.trim()}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating & Saving…
              </>
            ) : (
              <>
                <MaterialIcon name="save" />
                Validate & Save
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

