"use client"; // Add this line at the top of your component file

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"; // Import Trash2 icon for delete button

interface TestCase {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const SavedTestCasesPage = () => {
  const [savedTestCases, setSavedTestCases] = useState<TestCase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isProcessing = useRef(false); // Prevents duplicate calls

  useEffect(() => {
    const stored = localStorage.getItem("savedTestCases");
    const initialCases = stored ? JSON.parse(stored) : [];

    const seenIds = new Set<string>();
    const normalizedCases = initialCases.map((item: any) => {
      const id = item.id || crypto.randomUUID();
      if (seenIds.has(id)) {
        console.warn(`Duplicate ID detected: ${id}, generating new ID`);
        return {
          id: crypto.randomUUID(),
          title:
            item.title ||
            (typeof item === "string"
              ? item.split("\n")[0]
              : "Untitled Test Case"),
          content: typeof item === "string" ? item : item.content || "",
          createdAt: item.createdAt || new Date().toISOString(),
        };
      }
      seenIds.add(id);
      return {
        id,
        title:
          item.title ||
          (typeof item === "string"
            ? item.split("\n")[0]
            : "Untitled Test Case"),
        content: typeof item === "string" ? item : item.content || "",
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });

    setSavedTestCases(normalizedCases);
    localStorage.setItem("savedTestCases", JSON.stringify(normalizedCases));
  }, []);

  const toggleExpand = (
    id: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation(); // Prevent bubbling up

    setExpandedId((prevId) => (prevId === id ? null : id)); // Ensure only one card expands at a time
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  const deleteTestCase = (id: string) => {
    // Filter out the deleted test case from the state
    const updatedTestCases = savedTestCases.filter(
      (testCase) => testCase.id !== id
    );

    // Update the state
    setSavedTestCases(updatedTestCases);

    // Update localStorage
    localStorage.setItem("savedTestCases", JSON.stringify(updatedTestCases));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
      <Navigation />
      <div className="w-full max-w-3xl mt-16">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          📂 Saved Test Cases
        </h2>
        {savedTestCases.length > 0 ? (
          <div className="flex flex-col gap-6">
            {savedTestCases.map((testCase) => {
              // Check whether the current test case is expanded
              const isExpanded = expandedId === testCase.id;

              return (
                <div
                  key={testCase.id}
                  className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 transition-all transform hover:scale-105 hover:shadow-2xl hover:border-gray-600 relative"
                >
                  <div className="p-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={(e) => toggleExpand(testCase.id, e)}
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {testCase.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(testCase.createdAt)}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={24} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-400" />
                      )}
                    </div>

                    {/* Conditionally render delete icon if the card is expanded */}
                    {isExpanded && (
                      <div className="absolute top-32 right-20">
                        <button
                          onClick={() => deleteTestCase(testCase.id)}
                          className="text-gray-400 hover:text-red-500 focus:outline-none transition-all ease-in-out transform hover:scale-110"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}

                    {/* Only render content if the card is expanded */}
                    <div
                      className={`mt-4 bg-gray-700 text-gray-200 rounded-2xl p-6 transition-all ease-in-out overflow-hidden ${
                        isExpanded
                          ? "h-auto opacity-100" // Fully expanded
                          : "h-0 opacity-0" // Collapsed state, no visible content
                      }`}
                    >
                      <pre className="whitespace-pre-wrap text-sm p-4 bg-gray-600 rounded-lg border border-gray-500 shadow-inner">
                        {testCase.content}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg">
            No saved test cases yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedTestCasesPage;
