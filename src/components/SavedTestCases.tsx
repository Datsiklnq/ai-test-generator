"use client";
import { useState } from "react";
import { useCopy } from "./CopyContext"; // Adjust path as needed

interface SavedTestCasesProps {
  content: string;
  contentType: "testCase" | "testScript";
  onSave?: (content: string) => void;
}

const SavedTestCases: React.FC<SavedTestCasesProps> = ({
  content,
  contentType,
  onSave,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const { isCopied, copyToClipboard } = useCopy();

  const handleSave = () => {
    if (onSave) {
      onSave(content);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const buttonClass =
    "flex items-center gap-2 px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300";

  return (
    <div className="p-4">
      <pre className="whitespace-pre-wrap mb-2 p-4 bg-gray-800 text-white border rounded-md shadow-md text-sm leading-relaxed  ">
        {content}
      </pre>
      <div className="flex space-x-2 flex justify-between">
        {onSave && (
          <button onClick={handleSave} className={buttonClass}>
            {isSaved ? "✅ Saved!" : "💾 Save"}
          </button>
        )}
        <button
          onClick={() => copyToClipboard(content, contentType)}
          className={buttonClass}
        >
          {isCopied === contentType ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>
    </div>
  );
};

export default SavedTestCases;
