"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TestCase {
  id: string;
  content: string;
  createdAt: string; // Should be a valid ISO string.
}

const SavedTestCasesPage = () => {
  const [savedTestCases, setSavedTestCases] = useState<TestCase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("savedTestCases");
    const initialCases = stored ? JSON.parse(stored) : [];
    const normalizedCases = initialCases.map((item: any) => {
      // Ensuring each case has a proper createdAt field in ISO format.
      if (typeof item === "string") {
        return {
          id: crypto.randomUUID(),
          content: item,
          createdAt: new Date().toISOString(),
        };
      }
      return {
        ...item,
        createdAt: item.createdAt || new Date().toISOString(), // Handle missing createdAt
      };
    });

    setSavedTestCases(normalizedCases);
    localStorage.setItem("savedTestCases", JSON.stringify(normalizedCases));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTestCaseTitle = (content: string) => {
    const firstLine = content.split("\n")[0];
    return firstLine.length > 40 ? firstLine.slice(0, 40) + "..." : firstLine;
  };

  const getCreationDate = (createdAt: string) => {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Custom format example: "February 21, 2025 at 10:34 PM"
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // "Monday"
      year: "numeric", // "2025"
      month: "long", // "February"
      day: "numeric", // "21"
      hour: "numeric", // "10"
      minute: "numeric", // "34"
      second: "numeric", // "47"
      hour12: true, // Use 12-hour format
    };

    return new Intl.DateTimeFormat("en-US", options).format(date); // Adjust for your locale if necessary
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
      <Navigation />
      <div className="w-full max-w-3xl mt-16">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          📂 Saved Test Cases
        </h2>
        {savedTestCases.length > 0 ? (
          <ul className="space-y-4">
            {savedTestCases.map((testCase) => (
              <motion.li
                key={testCase.id}
                className="cursor-pointer bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-gray-700 hover:shadow-xl"
                onClick={() => toggleExpand(testCase.id)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-4 flex justify-between items-center bg-blue-600 text-white rounded-t-2xl">
                  <span className="font-medium text-lg">
                    {getTestCaseTitle(testCase.content)}
                  </span>
                  {expandedId === testCase.id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
                {expandedId === testCase.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 bg-gray-700 text-gray-200 rounded-b-2xl"
                  >
                    <pre className="whitespace-pre-wrap text-sm p-4 bg-gray-600 rounded-lg border border-gray-500 shadow-inner">
                      {testCase.content}
                    </pre>
                    {/* Show formatted timestamp */}
                    <p className="text-sm text-gray-400 mt-2">
                      Test Case Created on:{" "}
                      {getCreationDate(testCase.createdAt)}
                    </p>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
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
