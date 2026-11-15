"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SavedTestItem {
  id: string;
  title: string;
  content: string;
  contentType: "testCase" | "testScript";
  createdAt: string;
}

export default function SavedTestScriptsPage() {
  const [scripts, setScripts] = useState<SavedTestItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const response = await fetch("/api/saved-test-cases");
        if (!response.ok) throw new Error("Unable to load saved scripts.");
        const items: SavedTestItem[] = await response.json();
        setScripts(items.filter((item) => item.contentType === "testScript"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load saved scripts.");
      } finally {
        setLoading(false);
      }
    };
    void loadScripts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-24 text-gray-200">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-6 text-center text-3xl font-semibold text-white">Saved Test Scripts</h1>
        {loading && <p className="text-center text-gray-400">Loading saved scripts...</p>}
        {error && <p role="alert" className="text-center text-red-400">{error}</p>}
        {!loading && !error && scripts.length === 0 && (
          <p className="text-center text-gray-400">No saved test scripts yet.</p>
        )}
        <ul className="space-y-4">
          {scripts.map((script) => {
            const expanded = expandedId === script.id;
            return (
              <li key={script.id} className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => setExpandedId(expanded ? null : script.id)}
                  aria-expanded={expanded}
                >
                  <span>
                    <span className="block font-medium text-white">{script.title}</span>
                    <span className="text-sm text-gray-400">{new Date(script.createdAt).toLocaleString()}</span>
                  </span>
                  {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </button>
                {expanded && (
                  <pre className="whitespace-pre-wrap border-t border-gray-700 bg-gray-900 p-4 text-sm">{script.content}</pre>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
