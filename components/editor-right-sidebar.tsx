// components/EditorRightSidebar.tsx
import React, { useState } from "react";
import {
  CategoryIcon,
  AutoAwesomeIcon,
  RocketLaunchIcon,
  ContentCopyIcon,
  PublishIcon,
  AddIcon,
} from "./icons";

export const EditorRightSidebar = () => {
  const [subjectMode, setSubjectMode] = useState<"select" | "create">("select");
  const [topicMode, setTopicMode] = useState<"select" | "create">("select");

  return (
    <aside className="w-80 bg-surface-container-low/50 backdrop-blur-md border-l border-outline-variant/20 p-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col h-full gap-10">
        {/* 1. Classification Settings */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <CategoryIcon className="text-primary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              Classification
            </h3>
          </div>

          <div className="space-y-5">
            {/* Subject Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                  Subject Area
                </label>
                <button
                  onClick={() =>
                    setSubjectMode(
                      subjectMode === "select" ? "create" : "select",
                    )
                  }
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {subjectMode === "select" ? (
                    <>
                      <AddIcon className="text-[14px]" /> New
                    </>
                  ) : (
                    "Cancel"
                  )}
                </button>
              </div>

              {subjectMode === "select" ? (
                <div className="relative">
                  <select className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary appearance-none font-medium shadow-sm">
                    <option disabled selected>
                      Select Subject...
                    </option>
                    <option>Rajasthan History</option>
                    <option>Indian Polity</option>
                    <option>Geography</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-outline text-lg">
                    expand_more
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter new subject name..."
                  className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary shadow-sm font-medium"
                />
              )}
            </div>

            {/* Primary Topic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                  Primary Topic
                </label>
                <button
                  onClick={() =>
                    setTopicMode(topicMode === "select" ? "create" : "select")
                  }
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {topicMode === "select" ? (
                    <>
                      <AddIcon className="text-[14px]" /> New
                    </>
                  ) : (
                    "Cancel"
                  )}
                </button>
              </div>

              {topicMode === "select" ? (
                <div className="relative">
                  <select className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary appearance-none font-medium shadow-sm">
                    <option disabled selected>
                      Select Topic...
                    </option>
                    <option>Mewar Dynasty</option>
                    <option>Fundamental Rights</option>
                    <option>Aravalli Range</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-outline text-lg">
                    expand_more
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter new topic name..."
                  className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary shadow-sm font-medium"
                />
              )}
            </div>

            {/* Sub-Topic (Always Text Input) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-widest px-1">
                Sub-Topic (Optional)
              </label>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary shadow-sm font-medium"
                placeholder="e.g. Maharana Pratap era"
                type="text"
              />
            </div>
          </div>
        </div>

        {/* 2. AI Tools Section */}
        <div className="space-y-6 pt-10 border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <AutoAwesomeIcon className="text-tertiary" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              AI Prompt Tool
            </h3>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-tertiary/10 p-5 rounded-xl space-y-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Generate a structured JSON prompt based on your selected Subject,
              Topic, and Sub-topic to copy-paste into an LLM.
            </p>
            <button className="w-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
              <RocketLaunchIcon className="text-sm" />
              Generate Prompt Text
            </button>
          </div>

          <button className="w-full border-2 border-outline-variant text-on-surface-variant py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all">
            <ContentCopyIcon className="text-sm" />
            Copy AI Prompt
          </button>
        </div>

        {/* 3. Footer Actions */}
        <div className="mt-auto pt-10">
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3">
            <PublishIcon />
            Save to Local Store
          </button>
        </div>
      </div>
    </aside>
  );
};
