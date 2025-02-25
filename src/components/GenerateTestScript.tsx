"use client";

import SavedTestCases from "../components/SavedTestCases";

interface GenerateTestCaseProps {
  testScript: string;
}

const GenerateTestCase: React.FC<GenerateTestCaseProps> = ({ testScript }) => {
  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        📝 Test Script
      </h3>
      <pre className="whitespace-pre-wrap p-4 bg-gray-800 text-white border rounded-md shadow-md text-sm leading-relaxed">
        {testScript}
      </pre>
      <div className="mt-4 flex justify-between w-full">
        {/* No need to pass onSave anymore */}
        <SavedTestCases
          id={crypto.randomUUID()}
          content={testScript}
          contentType="testScript"
        />
      </div>
    </div>
  );
};

export default GenerateTestCase;
