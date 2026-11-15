"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCopy } from "./CopyContext";

interface SavedTestCasesProps {
  content: string;
  contentType: "testCase" | "testScript";
}

export default function SavedTestCases({ content, contentType }: SavedTestCasesProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { isCopied, copyToClipboard } = useCopy();

  const handleSave = async () => {
    try {
      const response = await fetch("/api/saved-test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, contentType }),
      });
      if (!response.ok) throw new Error("Save request failed");
      setIsSaved(true);
      toast.success(contentType === "testCase" ? "Test case saved." : "Test script saved.");
    } catch (error) {
      console.error("Unable to save generated item:", error);
      toast.error("Unable to save. Please try again.");
    }
  };

  const buttonClass = "flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition";
  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <button type="button" onClick={handleSave} disabled={isSaved} className={buttonClass}>
          {isSaved ? "Saved" : "Save"}
        </button>
        <button type="button" onClick={() => copyToClipboard(content, contentType)} className={buttonClass}>
          {isCopied === contentType ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
