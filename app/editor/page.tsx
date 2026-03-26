// app/editor/page.tsx
import React from "react";

import { VisibilityIcon } from "@/components/icons";
import { Sidebar } from "lucide-react";
import { JsonUploader } from "@/components/json-uploader";
import { EditorRightSidebar } from "@/components/editor-right-sidebar";

export default function QuestionEditor() {
  return (
    <div className="bg-surface font-body text-on-surface flex min-h-screen overflow-hidden">
      {/* I. Left Navigation */}
      <Sidebar />

      {/* II. Main Content Canvas */}
      <main className="ml-64 flex-1 flex flex-row overflow-hidden h-screen bg-surface">
        {/* A. Central JSON Upload Workspace */}
        <JsonUploader />

        {/* B. Right Sidebar (Settings & Context) */}
        <EditorRightSidebar />
      </main>

      {/* III. Floating Preview Button */}
      <button className="fixed bottom-8 right-[340px] w-14 h-14 bg-surface-container-highest rounded-full shadow-2xl flex items-center justify-center text-primary border border-white hover:scale-110 transition-transform z-50">
        <VisibilityIcon />
      </button>
    </div>
  );
}
