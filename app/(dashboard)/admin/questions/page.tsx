"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

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

interface RawInputQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  explanation?: string;
}

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

// ── SelectOrAdd component ──────────────────────────────────────────────────
interface SelectOrAddProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  onAddNew: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}

function SelectOrAdd({
  label,
  value,
  options,
  onChange,
  onAddNew,
  placeholder,
  disabled,
}: SelectOrAddProps) {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const trimmed = newVal.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (options.map((o) => o.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError("Already exists");
      return;
    }
    onAddNew(trimmed);
    setAdding(false);
    setNewVal("");
    setError("");
  };

  if (adding) {
    return (
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
          {label}{" "}
          <span className="text-primary normal-case font-normal">(new)</span>
        </label>
        <input
          autoFocus
          type="text"
          value={newVal}
          placeholder={placeholder}
          onChange={(e) => {
            setNewVal(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") {
              setAdding(false);
              setNewVal("");
              setError("");
            }
          }}
          className="w-full bg-surface-container-lowest border border-primary/40 rounded-xl p-3 text-sm outline-none text-on-surface focus:border-primary transition-colors"
        />
        {error && <p className="text-xs text-error">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-md transition-all"
          >
            ✓ Add
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewVal("");
              setError("");
            }}
            className="flex-1 py-2 rounded-xl border border-outline-variant/30 text-xs font-bold text-secondary hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value === "__ADD__") setAdding(true);
            else onChange(e.target.value);
          }}
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none appearance-none text-on-surface cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option disabled>──────────</option>
          <option value="__ADD__">+ Add New {label}</option>
        </select>
        <MaterialIcon
          name="expand_more"
          className="absolute right-3 top-3.5 pointer-events-none text-outline text-lg"
        />
      </div>
    </div>
  );
}

// ── Validation ─────────────────────────────────────────────────────────────
function validateInput(
  parsed: unknown,
):
  | { valid: true; questions: RawInputQuestion[] }
  | { valid: false; error: string } {
  if (!Array.isArray(parsed))
    return { valid: false, error: "Root must be a JSON array [ ... ]" };
  if (parsed.length === 0)
    return { valid: false, error: "Array must not be empty" };
  for (let i = 0; i < parsed.length; i++) {
    const q = parsed[i] as Record<string, unknown>;
    if (!q.question || typeof q.question !== "string")
      return {
        valid: false,
        error: `Question ${i + 1}: 'question' field is required`,
      };
    if (!Array.isArray(q.options) || q.options.length !== 4)
      return {
        valid: false,
        error: `Question ${i + 1}: 'options' must be an array of exactly 4 strings`,
      };
    if (
      (q.options as unknown[]).some(
        (o) => typeof o !== "string" || !(o as string).trim(),
      )
    )
      return {
        valid: false,
        error: `Question ${i + 1}: all 4 options must be non-empty strings`,
      };
    const ans = (q.correctAnswer ?? q.answer) as string | undefined;
    if (!ans)
      return {
        valid: false,
        error: `Question ${i + 1}: 'correctAnswer' or 'answer' is required`,
      };
    if (!(q.options as string[]).includes(ans))
      return {
        valid: false,
        error: `Question ${i + 1}: correctAnswer "${ans}" must match one of the options`,
      };
  }
  return { valid: true, questions: parsed as RawInputQuestion[] };
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

  // ── Validate ─────────────────────────────────────────────────────────
  const handleValidate = () => {
    setParseError("");
    setParseSuccess(false);
    setSaveMsg(null);
    if (!setName.trim()) {
      setParseError("Set Name is required before validating.");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const result = validateInput(parsed);
      if (!result.valid) {
        setParseError(result.error);
        return;
      }
      setParseSuccess(true);
      setValidatedCount(result.questions.length);
    } catch (e) {
      setParseError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!parseSuccess) {
      handleValidate();
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const parsed: RawInputQuestion[] = JSON.parse(jsonInput);
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

      // 2. Refresh is no longer loading stored locally to display, but we can reset form

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
        text: (e as Error).message || "Failed to save. Please re-validate.",
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
        <div className="max-w-3xl space-y-8">
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
              {parseSuccess && (
                <button
                  id="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-60 transition-all"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="save" className="text-base" />
                      Save to localStorage
                    </>
                  )}
                </button>
              )}
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
                  Clear
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
            onClick={parseSuccess ? handleSave : handleValidate}
            disabled={saving || !jsonInput.trim()}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <MaterialIcon name={parseSuccess ? "save" : "verified"} />
                {parseSuccess ? "Save to localStorage" : "Validate JSON"}
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

// ── AI Prompt Generator Component ──────────────────────────────────────────
function AiPromptSection({
  subject,
  topic,
}: {
  subject: string;
  topic: string;
}) {
  const [count, setCount] = useState(10);
  const [copied, setCopied] = useState(false);

  const prompt = `Generate ${count} multiple-choice questions for the topic "${topic}" under the subject "${subject}".

Return ONLY a valid JSON array. No extra text, no markdown, no code blocks. Just the raw JSON array.

Each question must follow this exact schema:
[
  {
    "id": "unique-string-id",
    "question": "The question text goes here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": "Option A text",
    "explanation": "40-60 word explanation of why this is the correct answer."
  }
]

Rules:
- "options" must be an array of exactly 4 non-empty strings
- "correctAnswer" must be the EXACT text of one of the 4 options (not a letter like "A")
- "explanation" is required and should be educational
- Questions should be exam-appropriate for competitive exams (RPSC, UPSC level)
- No repeated questions
- Output nothing except the JSON array`;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="space-y-4 pt-8 border-t border-outline-variant/20">
      <div className="flex items-center gap-2">
        <MaterialIcon name="auto_awesome" className="text-primary" />
        <h2 className="font-headline font-bold text-on-surface text-base">
          AI Prompt Generator
        </h2>
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
          ChatGPT / Gemini
        </span>
      </div>
      <p className="text-xs text-secondary leading-relaxed">
        किसी भी AI tool को यह prompt दें — वो exact JSON format में questions
        बनाएगा जो directly paste और save की जा सकती है।
      </p>

      {/* Count selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-secondary">
          Questions to generate:
        </label>
        <div className="flex gap-1.5">
          {[5, 10, 15, 20, 25].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={cn(
                "w-10 h-8 rounded-lg text-xs font-bold transition-all",
                count === n
                  ? "bg-primary text-white"
                  : "bg-surface-container text-secondary hover:bg-surface-container-high",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="relative">
        <div className="bg-surface-container rounded-xl p-4 text-xs font-mono text-on-surface-variant leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border border-outline-variant/20">
          {prompt}
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
            copied
              ? "bg-primary text-white shadow-md"
              : "bg-surface-container-high text-secondary hover:bg-primary hover:text-white",
          )}
        >
          <MaterialIcon
            name={copied ? "check" : "content_copy"}
            className="text-sm"
          />
          {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>

      <p className="text-[10px] text-secondary italic">
        💡 Tip: Copy → ChatGPT / Gemini → paste response back into JSON editor
        above → Validate → Save
      </p>
    </section>
  );
}
