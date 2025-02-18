// "use client"; // Needed for Next.js App Router

// import { useState } from "react";

// export default function TestCaseGenerator() {
//   const [testCase, setTestCase] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const generateTestCase = async () => {
//     setError(null); // Reset error before new request

//     try {
//       const response = await fetch("/api/generateTest", {
//         method: "POST", // ✅ Ensure it's POST, not GET
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt: "Generate a test case for login" }), // ✅ Send a prompt
//       });

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("✅ Response from API:", data);
//       setTestCase(data.testCase);
//     } catch (err: any) {
//       console.error("❌ Error:", err);
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>AI Test Case Generator</h1>
//       <button onClick={generateTestCase}>Generate Test Case</button>

//       {testCase && <p>🟢 Test Case: {testCase}</p>}
//       {error && <p>❌ Error: {error}</p>}
//     </div>
//   );
// }
