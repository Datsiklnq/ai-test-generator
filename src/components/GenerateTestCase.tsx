"use client";
interface GenerateTestCaseProps {
  testCase: string;
  isCopied: boolean;
  handleCopyToClipboard: () => void;
}

const GenerateTestCase: React.FC<GenerateTestCaseProps> = ({
  testCase,
  isCopied,
  handleCopyToClipboard,
}) => {
  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        📝 Test Case
      </h3>
      <pre className="whitespace-pre-wrap p-4 bg-gray-800 text-white border rounded-md shadow-md text-sm leading-relaxed">
        {testCase}
      </pre>
      <button
        onClick={handleCopyToClipboard}
        className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
      >
        {isCopied ? "✅ Copied!" : "📋 Copy Test Case"}
      </button>
    </div>
  );
};

export default GenerateTestCase;
