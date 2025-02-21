"use client";
import { useCopy } from "./CopyContext";
import SavedTestCases from "./SavedTestCases";

interface GenerateTestCaseProps {
  testCase: string;
}

const GenerateTestCase: React.FC<GenerateTestCaseProps> = ({ testCase }) => {

  const handleSave = (content: string) => {
    try {
      const storedCases = JSON.parse(
        localStorage.getItem("savedTestCases") || "[]"
      );
      const updatedCases = [...storedCases, content];
      localStorage.setItem("savedTestCases", JSON.stringify(updatedCases));
      console.log("Test case saved:", content); // Debugging
    } catch (error) {
      console.error("Error saving test case:", error);
    }
  };

  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        📝 Test Case
      </h3>

      <div className="mt-4 flex justify-between w-full">
        <SavedTestCases
          content={testCase} // Pass the test case content as a string
          contentType="testCase" // Specify the content type
          onSave={handleSave} // Pass the save handler
        />
      </div>
    </div>
  );
};

export default GenerateTestCase;
