"use client";

import SavedTestCases from "@/components/SavedTestCases";

export default function GenerateTestScript({ testScript }: { testScript: string }) {
  return (
    <section className="w-full rounded-xl border bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Test script</h2>
      <pre className="whitespace-pre-wrap rounded-md border bg-gray-800 p-4 text-sm leading-relaxed text-white">{testScript}</pre>
      <SavedTestCases content={testScript} contentType="testScript" />
    </section>
  );
}
