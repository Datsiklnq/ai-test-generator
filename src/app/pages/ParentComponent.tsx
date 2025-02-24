"use client";
import { useState } from "react";
import GenerateTestCase from "@/components/GenerateTestCase";
import GenerateTestScript from "@/components/GenerateTestScript";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { CopyProvider } from "@/components/CopyContext";

const ParentComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("cypress");
  const [testCase, setTestCase] = useState("");
  const [testScript, setTestScript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleGenerateTestCase();
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
    <CopyProvider>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
        <Navigation />
        <h2 className="mt-10 text-3xl font-semibold text-center text-white mb-8">
          ⚡ AI Test Case Generator
        </h2>

        {/* Framework Selector */}
        <div className="w-full max-w-2xl mb-6">
          <label className="block text-lg font-medium text-gray-300 mb-2">
            Select Framework:
          </label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full p-3 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-gray-700 transition"
          >
            <option value="cypress">Cypress</option>
            <option value="playwright">Playwright</option>
            <option value="selenium">Selenium</option>
          </select>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl mb-6">
          <label
            htmlFor="prompt"
            className="block text-lg font-medium text-gray-300 mb-2"
          >
            Enter Test Case Prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter test case prompt (e.g., 'Test login functionality')"
            className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 hover:bg-gray-700 transition resize-none"
            rows={4}
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateTestCase}
          disabled={loading}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-400 disabled:opacity-50 shadow-md transition-all"
        >
          {loading ? "Generating..." : "Generate Test Case"}
        </Button>

        {/* Results Section */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 w-full">
          {testCase && (
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 w-full max-w-2xl">
              <GenerateTestCase testCase={testCase} />
            </div>
          )}
          {testScript && (
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700 w-full max-w-2xl">
              <GenerateTestScript testScript={testScript} />
            </div>
          )}
        </div>
      </div>
    </CopyProvider>
  );
};

export default ParentComponent;
