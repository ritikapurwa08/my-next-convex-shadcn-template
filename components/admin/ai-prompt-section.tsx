"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

export function AiPromptSection({
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
