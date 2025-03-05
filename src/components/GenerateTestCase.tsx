"use client";
import { toast, ToastContainer } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css"; // Import styles
import SavedTestCases from "../components/SavedTestCases";

interface GenerateTestCaseProps {
  testCase: string;
}

const GenerateTestCase: React.FC<GenerateTestCaseProps> = ({ testCase }) => {
  const handleSave = async (content: string, id: string) => {
    try {
      const response = await fetch("/api/saved-test-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, content, contentType: "testCase" }),
      });

      if (!response.ok) {
        throw new Error("Failed to save test case");
      }

      toast.success("Test case saved successfully!", {
        toastId: `save-success-${id}`,
      });
    } catch (error) {
      console.error("Error saving test case:", error);
      toast.error("❌ Failed to save test case. Try again.", {
        toastId: `save-error-${id}`,
      });
    }
  };

  return (
    <div className="mt-4 w-full max-w-2xl p-6 border rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        📝 Test Case
      </h3>
      <pre className="whitespace-pre-wrap p-4 bg-gray-800 text-white border rounded-md shadow-md text-sm leading-relaxed">
        {testCase}
      </pre>
      <div className="mt-4 flex justify-between w-full">
        {testCase && (
          <SavedTestCases
            id={crypto.randomUUID()}
            content={testCase}
            contentType="testCase"
            onSave={handleSave}
          />
        )}
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
        className="fixed bottom-5 left-5 z-50"
      />
    </div>
  );
};

export default GenerateTestCase;
