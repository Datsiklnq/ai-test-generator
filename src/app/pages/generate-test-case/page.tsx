"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-950 to-black text-gray-200">
        <Navigation />

        {/* Title with Motion */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ⚡ AI Test Case Generator
        </motion.h2>

        {/* Framework Selector */}
        <motion.div
          className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <label className="block text-lg font-medium text-gray-300 mb-2">
            Select Framework:
          </label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full p-3 border border-gray-700 bg-white/10 backdrop-blur-lg text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-gray-700 transition"
          >
            <option value="cypress">Cypress</option>
            <option value="playwright">Playwright</option>
            <option value="selenium">Selenium</option>
          </select>
        </motion.div>

        {/* Prompt Input */}
        <motion.div
          className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
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
            className="w-full p-4 border border-gray-700 bg-white/10 backdrop-blur-lg text-white rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 hover:bg-gray-700 transition resize-none"
            rows={4}
          />
        </motion.div>

        {/* Generate Button with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Button
            onClick={handleGenerateTestCase}
            disabled={loading}
            className="relative px-10 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-blue-500/50"
          >
            {loading ? "Generating..." : "Generate Test Case"}
            <motion.span
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 blur-lg -z-10"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </Button>
        </motion.div>

        {/* Results Section with Animated Cards */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 w-full">
          {testCase && (
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 w-full max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <GenerateTestCase testCase={testCase} />
            </motion.div>
          )}
          {testScript && (
            <motion.div
              className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 w-full max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <GenerateTestScript testScript={testScript} />
            </motion.div>
          )}
        </div>
      </div>
    </CopyProvider>
  );
};

export default ParentComponent;
