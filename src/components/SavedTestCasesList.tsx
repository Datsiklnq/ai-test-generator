"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface TestCase {
  id: string;
  content: string; // Adjust this if your test case data structure has different fields
}

const SavedTestCasesList: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSavedTestCases = async () => {
      try {
        const response = await axios.get("/api/saved-test-cases");
        setTestCases(response.data);
      } catch (error) {
        console.error("Error fetching saved test cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTestCases();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Saved Test Cases</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className="p-4 border rounded-md shadow-md bg-gray-100"
            >
              <h3 className="text-xl font-semibold mb-2">
                Test Case {testCase.id}
              </h3>
              <pre className="whitespace-pre-wrap p-4 bg-gray-800 text-white">
                {testCase.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTestCasesList;
