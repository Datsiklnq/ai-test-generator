"use client";
import { useState } from "react";
import { Button } from "./ui/button"; // Assuming Button is a reusable component

const GenerateTestCase = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [testCase, setTestCase] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [framework, setFramework] = useState<string>("cypress"); // Default framework
  const [testScript, setTestScript] = useState<string>("");

  // Copy to clipboard function
  const handleCopyToClipboard = () => {
    if (testCase) {
      navigator.clipboard
        .writeText(testCase)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Error copying text: ", error);
        });
    }
  };

  // Generate test case function
  const handleGenerateTestCase = async () => {
    if (!prompt.trim()) {
      console.error("❌ No prompt entered!");
      return;
    }

    setLoading(true);
    setError(null);
    setTestCase("");
    setTestScript("");

    try {
      const response = await fetch("/api/generateTestScript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, framework }),
      });

      // ✅ Read response safely
      const text = await response.text();
      if (!text) throw new Error("❌ API returned an empty response.");
      console.log("API Response:", text); // Log the full response

      const data = JSON.parse(text);
      console.log("🟢 Full API Response:", data);

      if (response.ok) {
        if (data.testCase) {
          setTestCase(data.testCase); // Set the test case description
        } else {
          console.error("❌ Missing 'testCase' in API response:", data);
          setTestCase("No Test Case Description Available.");
        }

        if (data.testScript) {
          setTestScript(data.testScript); // Set the test script
        } else {
          console.error("❌ Missing 'testScript' in API response:", data);
          setError("Error: No Test Script Generated.");
        }
      } else {
        console.error("❌ API responded with error:", data.error);
        setError(data.error || "Error generating test case.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      console.error("❌ Fetch error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleGenerateTestCase();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        AI Test Case Generator
      </h2>

      {/* Framework selection */}
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

      {/* Test case input */}
      <div className="w-full max-w-2xl">
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
          placeholder="Enter test case prompt (e.g., 'Test login functionality')"
          onKeyDown={handleKeyPress}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none text-gray-800 placeholder-gray-500"
          rows={4}
        />
      </div>

      {/* Generate Button */}
      <Button
        aria-label="Generate Test Case"
        onClick={handleGenerateTestCase}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="ml-2">Generating...</span>
          </div>
        ) : (
          "Generate Test Case"
        )}
      </Button>

      {/* Error message */}
      {error && <p className="text-red-500 mt-4">{`❌ ${error}`}</p>}

      {/* Displaying the generated test case description */}
      {testCase && (
        <div className="w-full max-w-2xl p-4 bg-green-100 rounded-lg shadow-md mt-4">
          <p className="text-green-700 font-semibold text-xl">
            ✅ Generated Test Case:
          </p>
          <pre className="whitespace-pre-wrap break-words text-gray-800 mt-2">
            {testCase}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleCopyToClipboard}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isCopied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
          </pre>
        </div>
      )}

      {/* Displaying the generated test script (Code) */}
      {testScript && (
        <div className="w-full max-w-2xl p-4 bg-yellow-100 rounded-lg shadow-md mt-4">
          <p className="text-yellow-700 font-semibold text-xl">
            ✅ Generated Test Script (Code):
          </p>
          <pre className="whitespace-pre-wrap break-words text-gray-800 mt-2">
            {testScript}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GenerateTestCase;
