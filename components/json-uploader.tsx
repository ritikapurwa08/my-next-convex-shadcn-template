// components/JsonUploader.tsx
import React, { useState } from "react";
import { FileUploadIcon, JsonIcon } from "./icons";

export const JsonUploader = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jsonData, setJsonData] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          // Assuming the JSON is an array of questions
          setJsonData(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (error) {
          alert("Invalid JSON file. Please check the format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <section className="flex-1 overflow-y-auto p-12 no-scrollbar">
      <header className="mb-10">
        <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">
          Upload Assessment Data
        </h2>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase rounded-full tracking-widest">
            JSON Import Mode
          </span>
        </div>
      </header>

      <div className="space-y-8">
        {/* Drag & Drop Upload Zone */}
        {!jsonData ? (
          <div className="relative border-2 border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors flex flex-col items-center justify-center p-20 text-center group">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <FileUploadIcon className="text-4xl" />
            </div>
            <h3 className="font-headline font-bold text-xl text-on-surface mb-2">
              Drop your JSON file here
            </h3>
            <p className="text-sm font-body text-secondary max-w-sm leading-relaxed">
              Upload standard ExamOrbit JSON format containing questions,
              options, and pedagogical rationale.
            </p>
            <button className="mt-8 px-6 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-sm font-bold text-on-surface flex items-center gap-2 relative z-20 pointer-events-none">
              <JsonIcon /> Browse Local Files
            </button>
          </div>
        ) : (
          /* JSON Data Preview List */
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-secondary-container text-on-secondary-container px-6 py-4 rounded-xl">
              <div className="flex items-center gap-3">
                <JsonIcon />
                <div>
                  <p className="font-bold text-sm">
                    {fileName} loaded successfully
                  </p>
                  <p className="text-xs opacity-80">
                    {jsonData.length} questions detected
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setJsonData(null);
                  setFileName("");
                }}
                className="text-xs font-bold underline hover:opacity-80"
              >
                Clear & Re-upload
              </button>
            </div>

            <div className="space-y-4 pb-20">
              {jsonData.map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm"
                >
                  <div className="flex gap-4">
                    <span className="w-8 h-8 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-secondary">
                      {index + 1}
                    </span>
                    <div className="space-y-4 flex-1">
                      <h4 className="font-headline font-bold text-on-surface text-lg">
                        {item.prompt || item.question || "No prompt found"}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Assuming options are in an array or object */}
                        {item.options ? (
                          Array.isArray(item.options) ? (
                            item.options.map((opt: string, i: number) => (
                              <div
                                key={i}
                                className="bg-surface p-3 rounded-lg border border-outline-variant/10 text-sm flex gap-3"
                              >
                                <span className="font-bold text-secondary">
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span className="text-on-surface-variant">
                                  {opt}
                                </span>
                              </div>
                            ))
                          ) : (
                            Object.entries(item.options).map(
                              ([key, val], i) => (
                                <div
                                  key={i}
                                  className="bg-surface p-3 rounded-lg border border-outline-variant/10 text-sm flex gap-3"
                                >
                                  <span className="font-bold text-secondary">
                                    {key}.
                                  </span>
                                  <span className="text-on-surface-variant">
                                    {String(val)}
                                  </span>
                                </div>
                              ),
                            )
                          )
                        ) : (
                          <p className="text-sm text-error italic">
                            No options array/object found in JSON
                          </p>
                        )}
                      </div>

                      {item.rationale || item.explanation ? (
                        <div className="mt-4 p-4 bg-tertiary/5 border-l-4 border-tertiary rounded-r-lg">
                          <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">
                            Rationale
                          </p>
                          <p className="text-sm text-on-surface-variant italic leading-relaxed">
                            {item.rationale || item.explanation}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
