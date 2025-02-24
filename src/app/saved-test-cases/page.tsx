"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navigation from "@/components/Navigation";

interface TestCase {
  id: string;
  content: string;
  createdAt: string;
}

const SavedTestCasesPage = () => {
  const [savedTestCases, setSavedTestCases] = useState<TestCase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedTestCases = async () => {
      try {
        const response = await fetch("/api/saved-test-cases");
        if (!response.ok) {
          throw new Error("Failed to load test cases");
        }
        const data = await response.json();
        setSavedTestCases(data);
      } catch (error) {
        console.error("Error fetching test cases:", error);
      }
    };

    fetchSavedTestCases();
  }, []);

  const toggleExpand = (
    id: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    setExpandedId((prevId) => (prevId === id ? null : id)); // Toggle expansion
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Unknown Date";

    let date;

    if (typeof dateValue === "object" && dateValue._seconds) {
      // Firestore Timestamp conversion
      date = new Date(dateValue._seconds * 1000);
    } else if (typeof dateValue === "string" || typeof dateValue === "number") {
      // Handle ISO strings or numbers
      date = new Date(dateValue);
    } else {
      return "Invalid Date";
    }

    if (isNaN(date.getTime())) return "Invalid Date";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
      <div className="w-full max-w-3xl mt-16">
        <Navigation />
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          📂 Saved Test Cases
        </h2>
        {savedTestCases.length > 0 ? (
          <div className="flex flex-col gap-6">
            {savedTestCases.map((testCase) => {
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
                          Test Case {testCase.id.slice(-6)}
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

                    <div
                      className={`mt-4 bg-gray-700 text-gray-200 rounded-2xl p-6 transition-all ease-in-out overflow-hidden ${
                        isExpanded ? "h-auto opacity-100" : "h-0 opacity-0"
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
