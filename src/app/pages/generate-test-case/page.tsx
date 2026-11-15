"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";
import GenerateTestCase from "@/components/GenerateTestCase";
import GenerateTestScript from "@/components/GenerateTestScript";
import { Button } from "@/components/ui/button";

export default function GenerateTestPage() {
  const { user, loading: authLoading, getIdToken } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!authLoading && !user) router.replace("/login"); }, [authLoading, user, router]);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState("playwright");
  const [testCase, setTestCase] = useState("");
  const [testScript, setTestScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    setTestCase("");
    setTestScript("");

    try {
      const token = await getIdToken();
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: prompt.trim(), framework }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setTestCase(data.testCase);
      setTestScript(data.testScript);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate tests.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-950 to-black px-6 py-24 text-gray-200">
      <motion.h1
        className="mb-8 text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 md:text-5xl"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        AI Test Case Generator
      </motion.h1>

      <section className="mb-6 w-full max-w-2xl">
        <label htmlFor="framework" className="mb-2 block font-medium text-gray-300">Automation framework</label>
        <select
          id="framework"
          value={framework}
          onChange={(event) => setFramework(event.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white"
        >
          <option value="playwright">Playwright (TypeScript)</option>
          <option value="cypress">Cypress</option>
          <option value="selenium">Selenium</option>
        </select>
      </section>

      <section className="mb-6 w-full max-w-2xl">
        <label htmlFor="prompt" className="mb-2 block font-medium text-gray-300">Describe what you want to test</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleGenerate();
            }
          }}
          placeholder="Example: Verify that a user can sign in with valid credentials."
          rows={5}
          className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 p-4 text-white placeholder-gray-400"
        />
      </section>

      <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
        {loading ? "Generating..." : "Generate tests"}
      </Button>

      {error && <p role="alert" className="mt-5 text-red-400">{error}</p>}

      <div className="mt-8 flex w-full flex-wrap justify-center gap-6">
        {testCase && <div className="w-full max-w-2xl"><GenerateTestCase testCase={testCase} /></div>}
        {testScript && <div className="w-full max-w-2xl"><GenerateTestScript testScript={testScript} /></div>}
      </div>
    </main>
  );
}
