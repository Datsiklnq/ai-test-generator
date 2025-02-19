"use client";
import { useState, useEffect } from "react";
import GenerateTestCase from "@/components/GenerateTestCase";
import GenerateTestScript from "@/components/GenerateTestScript";
import SavedTestCase from "@/components/SavedTestCase";
import SavedTestScript from "@/components/SavedTestScript";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const ParentComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("cypress");
  const [testCase, setTestCase] = useState("");
  const [testScript, setTestScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedItem, setCopiedItem] = useState<
    "testCase" | "testScript" | null
  >(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [savedTestCases, setSavedTestCases] = useState<string[]>([]);
  const [savedTestScripts, setSavedTestScripts] = useState<string[]>([]);

  useEffect(() => {
    const storedCases = JSON.parse(
      localStorage.getItem("savedTestCases") || "[]"
    );
    const storedScripts = JSON.parse(
      localStorage.getItem("savedTestScripts") || "[]"
    );
    setSavedTestCases(storedCases);
    setSavedTestScripts(storedScripts);
  }, []);

  const handleCopyToClipboard = (
    text: string,
    type: "testCase" | "testScript"
  ) => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(null), 2000);
      });
    }
  };
  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleGenerateTestCase();
    }
  };

  const handleSaveTest = () => {
    if (testCase) {
      const updatedCases = [...savedTestCases, testCase];
      setSavedTestCases(updatedCases);
      localStorage.setItem("savedTestCases", JSON.stringify(updatedCases));
    }
    if (testScript) {
      const updatedScripts = [...savedTestScripts, testScript];
      setSavedTestScripts(updatedScripts);
      localStorage.setItem("savedTestScripts", JSON.stringify(updatedScripts));
    }
  };

  const handleGenerateTestCase = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      const response = await fetch("/api/generateTestCase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, framework }),
      });

      const data = await response.json();
      setTestCase(data.testCase);
      setTestScript(data.testScript);
    } catch (error) {
      console.error("Error generating test case:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <Navigation />
      {activeTab === "generate" ? (
        <>
          <h2 className=" mt-10 text-3xl font-semibold text-center text-gray-900 mb-6">
            AI Test Case Generator
          </h2>
          <div className="w-full max-w-2xl mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Framework:
            </label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 bg-white"
            >
              <option value="cypress">Cypress</option>
              <option value="playwright">Playwright</option>
              <option value="selenium">Selenium</option>
            </select>
          </div>
          <div className="w-full max-w-2xl mb-6">
            <label
              htmlFor="prompt"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Enter Test Case Prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter test case prompt (e.g., 'Test login functionality')"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none text-gray-800 placeholder-gray-500"
              rows={4}
            />
          </div>
          <Button
            onClick={handleGenerateTestCase}
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Test Case"}
          </Button>
          <div className="mt-4 flex flex-wrap justify-center gap-6 w-full">
            {testCase && (
              <GenerateTestCase
                testCase={testCase}
                isCopied={copiedItem === "testCase"}
                isSaved={false}
                handleCopyToClipboard={() =>
                  handleCopyToClipboard(testCase, "testCase")
                }
              />
            )}
            {testScript && (
              <GenerateTestScript
                testScript={testScript}
                isCopied={copiedItem === "testScript"}
                isSaved={false}
                handleCopyToClipboard={() =>
                  handleCopyToClipboard(testScript, "testScript")
                }
              />
            )}
          </div>
        </>
      ) : (
        <div className="w-full max-w-2xl">
          {/* <SavedTestCase savedTestCases={savedTestCases} /> */}
          {/* <SavedTestScript savedTestScripts={savedTestScripts} /> */}
        </div>
      )}
    </div>
  );
};

export default ParentComponent;
