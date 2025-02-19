"use client";
interface GenerateTestScriptProps {
  testScript: string;
  isCopied: boolean;
  handleCopyToClipboard: () => void;
}

const GenerateTestScript: React.FC<GenerateTestScriptProps> = ({
  testScript,
  isCopied,
  handleCopyToClipboard,
}) => {
  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        💻 Test Script
      </h3>
      <pre className="whitespace-pre-wrap p-4 bg-gray-800 text-white border rounded-md shadow-md text-sm leading-relaxed">
        {testScript}
      </pre>
      <button
        onClick={handleCopyToClipboard}
        className="mt-4 flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300"
      >
        {isCopied ? "✅ Copied!" : "📋 Copy Test Script"}
      </button>
    </div>
  );
};

export default GenerateTestScript;
