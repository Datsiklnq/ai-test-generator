"use client";
import { useCopy } from "./CopyContext";
import SavedTestCases from "./SavedTestCases";

interface GenerateTestScriptProps {
  testScript: string;
}

const GenerateTestScript: React.FC<GenerateTestScriptProps> = ({
  testScript,
}) => {
  const { isCopied, copyToClipboard } = useCopy();

  const handleSave = (content: string) => {
    const storedScripts = JSON.parse(
      localStorage.getItem("savedTestScripts") || "[]"
    );
    const updatedScripts = [...storedScripts, content];
    localStorage.setItem("savedTestScripts", JSON.stringify(updatedScripts));
  };

  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        💻 Test Script
      </h3>

      <SavedTestCases
        content={testScript}
        contentType="testScript"
        onSave={handleSave}
      />
    </div>
  );
};

export default GenerateTestScript;
