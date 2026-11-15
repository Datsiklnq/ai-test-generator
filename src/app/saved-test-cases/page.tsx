"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "@/components/ui/tooltip"; // Assuming you have a Tooltip component
import EditModal from "@/components/ui/editModal"; // Adjust the import path accordingly

interface TestCase {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string; // Optional updatedAt field
}

const SavedTestCasesPage = () => {
  const [savedTestCases, setSavedTestCases] = useState<TestCase[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");

  // Fetch test cases
  useEffect(() => {
    fetchTestCases();
  }, []);

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

  // Handle delete functionality
  const deleteTestCase = async (id: string) => {
    try {
      const response = await fetch("/api/saved-test-cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete test case");

      // After deletion, fetch the updated list
      fetchTestCases();

      // Show success message
      toast.success("Test case deleted successfully!");
    } catch (error) {
      console.error("Error deleting test case:", error);
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  // Handle expanding/collapsing of test case
  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Handle Edit button click
  const handleEditClick = (testCase: TestCase) => {
    setEditingTestCase(testCase);
    setNewTitle(testCase.title);
    setNewContent(testCase.content);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editingTestCase) return;

    const updatedTestCase = {
      ...editingTestCase,
      title: newTitle,
      content: newContent,
      updatedAt: new Date().toISOString(), // Set updatedAt to the current time
    };

    try {
      // Send the updated test case to the API
      const response = await fetch("/api/saved-test-cases", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTestCase),
      });

      if (!response.ok) throw new Error("Failed to update test case");

      // Update the test cases state with the new edited test case
      setSavedTestCases((prev) =>
        prev.map((testCase) =>
          testCase.id === updatedTestCase.id ? updatedTestCase : testCase
        )
      );

      toast.success("Test case updated successfully!");

      // Close the edit modal
      setEditingTestCase(null);
    } catch (error) {
      console.error("Error updating test case:", error);
      toast.error("Oops! Something went wrong. Please try again.");
    }
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingTestCase(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gray-900 text-gray-200">
      <h2 className="text-3xl font-semibold text-center text-white mb-6">
        📂 Saved Test Cases
      </h2>
      {savedTestCases.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {savedTestCases.map((testCase) => {
            const isExpanded = expandedId === testCase.id;

            return (
              <div
                key={testCase.id}
                className="bg-gray-800 rounded-3xl shadow-xl border border-gray-700 transition-all transform hover:scale-105 hover:shadow-2xl relative"
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
                        Created At:{" "}
                        {new Date(testCase.createdAt).toLocaleString()}
                      </p>
                      {testCase.updatedAt && (
                        <p className="text-sm text-gray-400">
                          Last updated:{" "}
                          {new Date(testCase.updatedAt).toLocaleString()}
                        </p>
                      )}
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

                      {/* Delete and Edit Buttons */}
                      <div className="mt-4 flex justify-end space-x-4">
                        <Tooltip text="Edit Test Case">
                          <button
                            onClick={() => handleEditClick(testCase)}
                            className="text-gray-400 hover:text-teal-400 transition-transform"
                          >
                            <Edit size={20} />
                          </button>
                        </Tooltip>
                        <Tooltip text="Delete Test Case">
                          <button
                            onClick={() => deleteTestCase(testCase.id)}
                            className="text-gray-400 hover:text-red-500 transition-transform"
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

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingTestCase}
        onClose={handleCancelEdit}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newContent={newContent}
        setNewContent={setNewContent}
        handleSaveEdit={handleSaveEdit}
      />

      {/* Toast Container for success and error messages */}
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeButton={true}
      />
    </div>
  );
};

export default SavedTestCasesPage;
