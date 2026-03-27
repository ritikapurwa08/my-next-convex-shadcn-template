"use client";

// ============================================================
// फाइल को यहाँ रखें:  app/admin/page.tsx
// (पुरानी file को पूरी तरह replace करें)
// ============================================================

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Sidebar from "@/components/layout/sidebar";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

// ─── Default seed data (हार्डकोड — नए subjects/topics runtime में add होते हैं) ───
const DEFAULT_SUBJECTS = [
  "Rajasthan History",
  "Rajasthan Geography",
  "Indian Polity",
  "Art & Culture",
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
  "Rajasthan Geography": ["Aravalli Range", "Thar Desert", "Rivers", "Climate"],
  "Indian Polity": [
    "Constitutional Framework",
    "Fundamental Rights",
    "DPSP",
    "Parliament",
  ],
  "Art & Culture": ["Folk Music", "Handicrafts", "Festivals", "Architecture"],
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

const SAMPLE_JSON_TEMPLATE = `[
  {
    "id": "unique-id-001",
    "question": "Your question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "40-50 words explanation of why the correct answer is right."
  }
]`;

const AI_PROMPT_TEMPLATE = (subject: string, topic: string) =>
  `Generate 10 multiple-choice questions about "${topic}" from the subject "${subject}" for a competitive exam like RPSC/RAS. Each question must have exactly 4 options, one correct answer, and a 40-50 word explanation. Return ONLY a valid JSON array in this format:\n[{ "id": "unique-id", "question": "...", "options": ["A","B","C","D"], "correctAnswer": "A", "explanation": "..." }]`;

// ─── छोटा reusable component: Dropdown + "Add New" ─────────
// value        = currently selected value
// options      = list of existing options
// onChange     = जब existing option चुनें
// onAddNew     = जब नया नाम confirm करें
// label        = "Subject" / "Topic" / "Set Name"
// placeholder  = input placeholder when adding new
interface SelectOrAddProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  onAddNew: (val: string) => void;
  label: string;
  placeholder: string;
}

function SelectOrAdd({
  value,
  options,
  onChange,
  onAddNew,
  label,
  placeholder,
}: SelectOrAddProps) {
  const ADD_NEW_SENTINEL = "__ADD_NEW__";
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState("");
  const [error, setError] = useState("");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_SENTINEL) {
      setAdding(true);
      setNewVal("");
      setError("");
    } else {
      onChange(e.target.value);
    }
  };

  const handleConfirm = () => {
    const trimmed = newVal.trim();
    if (!trimmed) {
      setError("नाम खाली नहीं हो सकता");
      return;
    }
    if (options.map((o) => o.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError("यह नाम पहले से exist करता है");
      return;
    }
    onAddNew(trimmed);
    setAdding(false);
    setNewVal("");
    setError("");
  };

  const handleCancel = () => {
    setAdding(false);
    setNewVal("");
    setError("");
  };

  if (adding) {
    return (
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
          {label}{" "}
          <span className="text-primary normal-case font-normal">
            (नया बनाएं)
          </span>
        </label>
        <input
          autoFocus
          type="text"
          value={newVal}
          onChange={(e) => {
            setNewVal(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") handleCancel();
          }}
          placeholder={placeholder}
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
            onClick={handleCancel}
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
      <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none appearance-none text-on-surface cursor-pointer"
          value={value}
          onChange={handleSelectChange}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option disabled>──────────</option>
          <option value={ADD_NEW_SENTINEL}>+ नया {label} बनाएं</option>
        </select>
        <MaterialIcon
          name="expand_more"
          className="absolute right-3 top-3 pointer-events-none text-outline text-lg"
        />
      </div>
    </div>
  );
}

// ─── Set Name: text input (1-5 buttons हटाए) ────────────────
interface SetNameInputProps {
  value: string;
  onChange: (val: string) => void;
}

function SetNameInput({ value, onChange }: SetNameInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
        Set Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Chauhan-Dynasty-Part-1"
        className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none text-on-surface focus:border-primary/40 transition-colors font-mono"
      />
      <p className="text-[10px] text-secondary">
        Spaces की जगह hyphen (-) इस्तेमाल करें। यही फाइल का नाम बनेगा।
      </p>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────
export default function AdminPage() {
  const user = useQuery(api.users.current);

  // Dynamic subject & topic lists (session में add होते हैं)
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [topicMap, setTopicMap] =
    useState<Record<string, string[]>>(DEFAULT_TOPIC_MAP);

  const [subject, setSubject] = useState(DEFAULT_SUBJECTS[0]);
  const [topic, setTopic] = useState(DEFAULT_TOPIC_MAP[DEFAULT_SUBJECTS[0]][0]);
  const [setName, setSetName] = useState("");

  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    ok: boolean;
    msg: string;
    path?: string;
  } | null>(null);

  // AI generator
  const [aiPrompt, setAiPrompt] = useState("");

  // ── Handlers: subject ──────────────────────────────────────
  const handleSubjectChange = (s: string) => {
    setSubject(s);
    const topics = topicMap[s] ?? [];
    setTopic(topics[0] ?? "");
  };

  const handleAddSubject = (newSubject: string) => {
    setSubjects((prev) => [...prev, newSubject]);
    setTopicMap((prev) => ({ ...prev, [newSubject]: [] }));
    setSubject(newSubject);
    setTopic("");
  };

  // ── Handlers: topic ────────────────────────────────────────
  const handleAddTopic = (newTopic: string) => {
    setTopicMap((prev) => ({
      ...prev,
      [subject]: [...(prev[subject] ?? []), newTopic],
    }));
    setTopic(newTopic);
  };

  // ── Validate JSON ──────────────────────────────────────────
  const handleValidate = () => {
    setParseError("");
    setParseSuccess(false);
    setSaveResult(null);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed))
        throw new Error("Root must be a JSON array [ ... ]");
      parsed.forEach((q: Record<string, unknown>, i: number) => {
        if (
          !q.id ||
          !q.question ||
          !Array.isArray(q.options) ||
          !q.correctAnswer ||
          !q.explanation
        )
          throw new Error(
            `Question ${i + 1}: id, question, options, correctAnswer, explanation — सब ज़रूरी हैं।`,
          );
        if ((q.options as unknown[]).length < 4)
          throw new Error(`Question ${i + 1}: कम से कम 4 options होने चाहिए।`);
      });
      setParseSuccess(true);
    } catch (e) {
      setParseError((e as Error).message);
    }
  };

  // ── Save to local filesystem via API route ─────────────────
  const handleSave = async () => {
    if (!setName.trim()) {
      setParseError("Set Name खाली है — पहले Set Name लिखें।");
      return;
    }
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/save-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          setName: setName.trim().replace(/\s+/g, "-"),
          questions: JSON.parse(jsonInput),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaveResult({ ok: true, msg: data.message, path: data.savedTo });
    } catch (e) {
      setSaveResult({ ok: false, msg: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  // ── File path preview ──────────────────────────────────────
  const previewPath = `data/questions/${subject.replace(/\s+/g, "-")}/${topic.replace(/\s+/g, "-")}/${setName.trim().replace(/\s+/g, "-") || "<set-name>"}.json`;

  // ── Guards ─────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center">
            <MaterialIcon name="lock" className="text-error text-3xl" />
          </div>
          <h2 className="font-headline font-bold text-2xl text-on-surface">
            Access Denied
          </h2>
          <p className="text-secondary text-sm max-w-sm">
            This page is restricted to administrators only.
          </p>
        </main>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      {/* ── Main editor ── */}
      <main className="flex-1 ml-64 mr-80 overflow-y-auto p-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase rounded-full tracking-widest">
              Admin Panel
            </span>
            <span className="text-secondary text-xs font-label">
              Content Management
            </span>
          </div>
          <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">
            Upload Questions
          </h2>
          <p className="text-sm text-secondary mt-1">
            JSON paste करें, subject/topic/set चुनें, और locally save करें।
          </p>
        </header>

        <div className="max-w-3xl space-y-8">
          {/* JSON Paste area */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-headline font-bold text-on-surface text-base">
                Paste Question JSON
              </label>
              <button
                onClick={() => setJsonInput(SAMPLE_JSON_TEMPLATE)}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Insert template
              </button>
            </div>

            <div
              className={cn(
                "rounded-xl ring-1 ring-inset overflow-hidden",
                parseError
                  ? "ring-error/40"
                  : parseSuccess
                    ? "ring-primary/40"
                    : "ring-outline-variant/30",
              )}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-surface-container text-xs text-secondary">
                <span className="font-mono">questions.json</span>
                <span>{jsonInput ? `${jsonInput.length} chars` : "empty"}</span>
              </div>
              <textarea
                className="w-full bg-surface-container-lowest border-none outline-none p-5 min-h-[260px] text-sm font-mono text-on-surface resize-y leading-relaxed"
                placeholder={SAMPLE_JSON_TEMPLATE}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setParseSuccess(false);
                  setParseError("");
                  setSaveResult(null);
                }}
              />
            </div>

            {/* Error / Success messages */}
            {parseError && (
              <div className="flex items-start gap-2 p-3 bg-error-container/20 border border-error/20 rounded-xl text-sm text-error">
                <MaterialIcon
                  name="error"
                  className="text-base shrink-0 mt-0.5"
                />
                {parseError}
              </div>
            )}
            {parseSuccess && !saveResult && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary">
                <MaterialIcon name="check_circle" className="text-base" />
                JSON valid है — अब Save कर सकते हैं।
              </div>
            )}
            {saveResult && (
              <div
                className={cn(
                  "flex items-start gap-2 p-3 rounded-xl text-sm border",
                  saveResult.ok
                    ? "bg-primary/5 border-primary/20 text-primary"
                    : "bg-error-container/20 border-error/20 text-error",
                )}
              >
                <MaterialIcon
                  name={saveResult.ok ? "check_circle" : "error"}
                  className="text-base shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-bold">{saveResult.msg}</p>
                  {saveResult.path && (
                    <p className="font-mono text-xs mt-1 opacity-70">
                      → {saveResult.path}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleValidate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface hover:bg-surface-container transition-colors"
              >
                <MaterialIcon name="verified" className="text-base" />
                Validate JSON
              </button>

              {parseSuccess && (
                <button
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
                      <MaterialIcon name="save" />
                      Validate &amp; Save Locally
                    </>
                  )}
                </button>
              )}
            </div>
          </section>

          {/* AI Generator */}
          <section className="space-y-4 pt-8 border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <MaterialIcon name="auto_awesome" className="text-primary" />
              <h3 className="font-headline font-bold text-on-surface text-base">
                AI Question Generator
              </h3>
            </div>
            <p className="text-sm text-secondary">
              किसी भी AI tool (ChatGPT, Gemini) के लिए prompt generate करें —
              सही format में questions बनाने के लिए।
            </p>

            <button
              onClick={() => setAiPrompt(AI_PROMPT_TEMPLATE(subject, topic))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm font-bold text-on-surface hover:border-primary/30 transition-colors"
            >
              <MaterialIcon name="auto_awesome" className="text-base" />
              Generate Prompt for &quot;{topic || subject}&quot;
            </button>

            {aiPrompt && (
              <div className="bg-surface-container rounded-xl p-4 relative">
                <pre className="text-xs font-mono text-on-surface-variant whitespace-pre-wrap leading-relaxed pr-8">
                  {aiPrompt}
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(aiPrompt)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                  title="Copy prompt"
                >
                  <MaterialIcon
                    name="content_copy"
                    className="text-sm text-secondary"
                  />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Right classification panel ── */}
      <aside className="w-80 fixed right-0 top-0 h-screen bg-surface-container-low border-l border-outline-variant/20 p-7 overflow-y-auto flex flex-col">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-2">
            <MaterialIcon name="category" className="text-primary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              Classification
            </h3>
          </div>

          {/* Subject — dropdown + Add New */}
          <SelectOrAdd
            label="Subject"
            value={subject}
            options={subjects}
            onChange={handleSubjectChange}
            onAddNew={handleAddSubject}
            placeholder="e.g. Modern History"
          />

          {/* Topic — dropdown + Add New (subject पर depend करता है) */}
          <SelectOrAdd
            label="Topic"
            value={topic}
            options={topicMap[subject] ?? []}
            onChange={setTopic}
            onAddNew={handleAddTopic}
            placeholder="e.g. Mughal Empire"
          />

          {/* Set Name — free text input */}
          <SetNameInput value={setName} onChange={setSetName} />

          {/* Live file path preview */}
          <div className="p-3 bg-surface-container rounded-xl">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
              Save path preview
            </p>
            <p className="text-xs font-mono text-on-surface-variant break-all leading-relaxed">
              {previewPath}
            </p>
          </div>
        </div>

        {/* Bottom: single save button */}
        <div className="pt-6 border-t border-outline-variant/20">
          <button
            onClick={parseSuccess ? handleSave : handleValidate}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <MaterialIcon name="save" />
                {parseSuccess ? "Validate & Save Locally" : "Validate JSON"}
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
