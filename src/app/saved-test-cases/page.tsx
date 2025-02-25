"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Correct import for ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import { Tooltip } from "@/components/ui/tooltip";

interface TestCase {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const SavedTestCasesPage = () => {
  const [savedTestCases, setSavedTestCases] = useState<TestCase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestCases();
  }, []);

  // Function to fetch the test cases
  const fetchTestCases = async () => {
    try {
      const response = await fetch("/api/saved-test-cases");
      if (!response.ok) throw new Error("Failed to fetch test cases");
      const data = await response.json();
      setSavedTestCases(data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      toast.error("Failed to load test cases. Please try again.");
    }
  };

  // Function to handle delete request
  const deleteTestCase = async (id: string) => {
    try {
      const response = await fetch("/api/saved-test-cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete test case");

      // After deleting, fetch the updated list of test cases
      fetchTestCases();

      // Show a success toast notification
      toast.success("Test case deleted successfully!");
    } catch (error) {
      console.error("Error deleting test case:", error);
      // Show error toast with custom design and message
      toast.error("Oops! Something went wrong. Please try again.", {
        position: "bottom-left",
        autoClose: 3000, // Stay for 5 seconds
        hideProgressBar: false,
        theme: "dark", // Dark theme for error toasts
      });
    }
  };

  // Only for testing
  // const deleteTestCase = async (id: string) => {
  //   try {
  //     // Introduce an error deliberately
  //     throw new Error("Manual error for testing");

  //     // Normally, the deletion code would go here
  //   } catch (error) {
  //     console.error("Error deleting test case:", error);
  //     toast.error("Oops! Something went wrong. Please try again.", {
  //       position: "bottom-left",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       theme: "dark",
  //     });
  //   }
  // };

  // Function to handle expanding/collapsing of the test case
  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
      <Navigation />
      <div className="w-full max-w-3xl mt-16">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          📂 Saved Test Cases
        </h2>
        {savedTestCases.length > 0 ? (
          <div className="flex flex-col gap-6">
            {savedTestCases.map((testCase) => {
              const isExpanded = expandedId === testCase.id;

              return (
                <div
                  key={testCase.id}
                  className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 transition-all transform hover:scale-105 hover:shadow-2xl hover:border-gray-600 relative"
                >
                  <div className="p-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(testCase.id)}
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {testCase.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(testCase.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={24} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-400" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 bg-gray-700 text-gray-200 rounded-2xl p-6">
                        <pre className="whitespace-pre-wrap text-sm p-4 bg-gray-600 rounded-lg border border-gray-500 shadow-inner">
                          {testCase.content}
                        </pre>

                        {/* Delete Button */}
                        <div className="mt-4 flex justify-end">
                          <Tooltip text="Delete Test Case">
                            <button
                              onClick={() => deleteTestCase(testCase.id)}
                              className="text-gray-400 hover:text-red-500 focus:outline-none transition-all ease-in-out transform hover:scale-110"
                            >
                              <Trash2 size={20} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg">
            No saved test cases yet.
          </p>
        )}
      </div>

      {/* Toast Container for success and error messages */}
      <ToastContainer
        position="bottom-left" // Position the toast at the bottom left
        autoClose={3000} // Auto close after 3 seconds
        hideProgressBar={true} // Hide the progress bar
        newestOnTop={true} // Show newest toast on top
        closeButton={true} // Optional: hide close button
      />
    </div>
  );
};

export default SavedTestCasesPage;
