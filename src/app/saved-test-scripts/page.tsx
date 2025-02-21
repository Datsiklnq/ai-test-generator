"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import Chevron icons

interface TestScript {
  id: string;
  content: string;
  createdAt: string; // Add createdAt field to store the creation timestamp
}

const SavedTestScriptsPage = () => {
  const [savedScripts, setSavedScripts] = useState<TestScript[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Initialize saved test scripts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedTestScripts");
    const initialScripts = stored ? JSON.parse(stored) : [];
    console.log("Initial scripts from localStorage:", initialScripts); // Debug log

    // Normalize scripts and ensure each script has a createdAt timestamp
    const normalizedScripts = initialScripts
      .map((item: any) =>
        typeof item === "string"
          ? {
              id: crypto.randomUUID(),
              content: item,
              createdAt: new Date().toISOString(), // Add current timestamp
            }
          : item
      )
      .filter(
        (item: any) =>
          item &&
          typeof item === "object" &&
          "id" in item &&
          "content" in item &&
          "createdAt" in item
      );

    setSavedScripts(normalizedScripts);
    localStorage.setItem("savedTestScripts", JSON.stringify(normalizedScripts));
  }, []);

  // Toggle expansion for displaying content
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          📂 Saved Test Scripts
        </h2>
        {savedScripts.length > 0 ? (
          <ul className="space-y-4">
            {savedScripts.map((script) => (
              <motion.li
                key={script.id}
                className="cursor-pointer bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border border-gray-700 hover:shadow-xl"
                onClick={() => toggleExpand(script.id)}
              >
                <div className="p-4 flex justify-between items-center bg-blue-600 text-white rounded-t-2xl">
                  <span className="font-medium text-lg">
                    Test Script Created on: {getCreationDate(script.createdAt)}
                  </span>
                  {expandedId === script.id ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </div>
                {expandedId === script.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 bg-gray-700 text-gray-200 rounded-b-2xl"
                  >
                    <pre className="whitespace-pre-wrap text-sm p-4 bg-gray-600 rounded-lg border border-gray-500 shadow-inner">
                      {script.content}
                    </pre>
                    <p className="text-gray-400 text-xs mt-2">
                      Created on: {getCreationDate(script.createdAt)}
                    </p>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center text-lg">
            No saved test scripts yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedTestScriptsPage;
