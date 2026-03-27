"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Sidebar from "@/components/layout/sidebar";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "Rajasthan History",
  "Rajasthan Geography",
  "Indian Polity",
  "Art & Culture",
  "Indian Geography",
  "Psychology",
];

const TOPIC_MAP: Record<string, string[]> = {
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
  `Generate 10 multiple-choice questions about "${topic}" from the subject "${subject}" for a competitive exam like RPSC/RAS. Each question must have exactly 4 options, one correct answer, and a 40-50 word explanation. Return ONLY a valid JSON array in this format:
[{ "id": "unique-id", "question": "...", "options": ["A","B","C","D"], "correctAnswer": "A", "explanation": "..." }]`;

export default function AdminPage() {
  const user = useQuery(api.users.current);

  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [topic, setTopic] = useState(TOPIC_MAP[SUBJECTS[0]][0]);
  const [setNumber, setSetNumber] = useState(1);
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState("");
  const [parseSuccess, setParseSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // AI generator
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState("");

  // Guard: only admin
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
            This page is restricted to administrators only. Contact your admin
            to request access.
          </p>
        </main>
      </div>
    );
  }

  const handleSubjectChange = (s: string) => {
    setSubject(s);
    setTopic(TOPIC_MAP[s][0]);
  };

  const handleValidate = () => {
    setParseError("");
    setParseSuccess(false);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error("Root must be a JSON array");
      parsed.forEach((q: Record<string, unknown>, i: number) => {
        if (
          !q.id ||
          !q.question ||
          !Array.isArray(q.options) ||
          !q.correctAnswer ||
          !q.explanation
        )
          throw new Error(`Question ${i + 1} is missing required fields.`);
        if ((q.options as unknown[]).length < 2)
          throw new Error(`Question ${i + 1} must have at least 2 options.`);
      });
      setParseSuccess(true);
    } catch (e) {
      setParseError((e as Error).message);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // In production: POST to local Bun proxy server that writes to /data/questions folder
    // For now, simulate save
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleGeneratePrompt = () => {
    setAiPrompt(AI_PROMPT_TEMPLATE(subject, topic));
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
  };

  const handlePasteAiOutput = () => {
    setJsonInput(aiOutput);
    setAiOutput("");
    setParseSuccess(false);
    setParseError("");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      {/* Main editor */}
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
            Paste a JSON array of questions to bulk upload to a subject and
            topic.
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
                }}
              />
            </div>

            {parseError && (
              <div className="flex items-start gap-2 p-3 bg-error-container/20 border border-error/20 rounded-xl text-sm text-error">
                <MaterialIcon
                  name="error"
                  className="text-base shrink-0 mt-0.5"
                />
                {parseError}
              </div>
            )}
            {parseSuccess && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm text-primary">
                <MaterialIcon name="check_circle" className="text-base" />
                JSON is valid and ready to save.
              </div>
            )}

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
                  ) : saved ? (
                    <>
                      <MaterialIcon name="check" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="save" />
                      Save to {subject} / {topic} (Set {setNumber})
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
              Generate a prompt for any AI tool (ChatGPT, Claude, Gemini) to
              produce questions in the correct format.
            </p>

            <button
              onClick={handleGeneratePrompt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-sm font-bold text-on-surface hover:border-primary/30 transition-colors"
            >
              <MaterialIcon name="generate" className="text-base" />
              Generate Prompt for &quot;{topic}&quot;
            </button>

            {aiPrompt && (
              <div className="space-y-3">
                <div className="bg-surface-container rounded-xl p-4 relative">
                  <pre className="text-xs font-mono text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                    {aiPrompt}
                  </pre>
                  <button
                    onClick={handleCopyPrompt}
                    className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                    title="Copy prompt"
                  >
                    <MaterialIcon
                      name="content_copy"
                      className="text-sm text-secondary"
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Paste AI output here
                  </label>
                  <textarea
                    className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/20 outline-none p-4 min-h-[120px] text-sm font-mono text-on-surface resize-y"
                    placeholder="Paste the JSON output from your AI tool…"
                    value={aiOutput}
                    onChange={(e) => setAiOutput(e.target.value)}
                  />
                  {aiOutput && (
                    <button
                      onClick={handlePasteAiOutput}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-sm font-bold hover:bg-primary/15 transition-colors"
                    >
                      <MaterialIcon name="arrow_upward" className="text-sm" />
                      Move to JSON editor
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Right classification panel */}
      <aside className="w-80 fixed right-0 top-0 h-screen bg-surface-container-low border-l border-outline-variant/20 p-7 overflow-y-auto flex flex-col">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-2">
            <MaterialIcon name="category" className="text-primary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              Classification
            </h3>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
              Subject
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none appearance-none text-on-surface"
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-3 top-3 pointer-events-none text-outline text-lg"
              />
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
              Topic
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-sm outline-none appearance-none text-on-surface"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {(TOPIC_MAP[subject] ?? []).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-3 top-3 pointer-events-none text-outline text-lg"
              />
            </div>
          </div>

          {/* Set number */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
              Set Number
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setSetNumber(n)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-bold border transition-colors",
                    setNumber === n
                      ? "bg-primary text-white border-primary"
                      : "border-outline-variant/20 text-secondary hover:border-primary/30",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* File path preview */}
          <div className="p-3 bg-surface-container rounded-xl">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
              Save path
            </p>
            <p className="text-xs font-mono text-on-surface-variant break-all">
              /data/questions/{subject.toLowerCase().replace(/ /g, "-")}/
              {topic.toLowerCase().replace(/ /g, "-")}-set{setNumber}.json
            </p>
          </div>
        </div>

        {/* Publish */}
        <div className="pt-6 border-t border-outline-variant/20">
          <button
            onClick={parseSuccess ? handleSave : handleValidate}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            <MaterialIcon name="publish" />
            {parseSuccess ? "Publish to Orbit" : "Validate & Publish"}
          </button>
        </div>
      </aside>
    </div>
  );
}
