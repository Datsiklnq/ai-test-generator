// "use client";
// import { useState } from "react";
// import { toast } from "react-toastify";

// interface EditTestCaseModalProps {
//   id: string;
//   content: string;
//   onClose: () => void;
//   onUpdate?: (content: string, id: string) => void;
// }

// const EditTestCaseModal: React.FC<EditTestCaseModalProps> = ({
//   id,
//   content,
//   onClose,
//   onUpdate,
// }) => {
//   const [updatedContent, setUpdatedContent] = useState(content);

//   const handleUpdate = async () => {
//     if (!onUpdate) return;

//     try {
//       await onUpdate(updatedContent, id);
//       toast.success("Test case updated successfully!");
//       onClose(); // Close modal after updating
//     } catch (error) {
//       console.error("Error updating test case:", error);
//       toast.error("Failed to update. Try again.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-lg font-semibold mb-4">Edit Test Case</h2>
//         <textarea
//           value={updatedContent}
//           onChange={(e) => setUpdatedContent(e.target.value)}
//           className="w-full h-32 p-2 border rounded"
//         />
//         <div className="flex justify-end mt-4 gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-400 text-white rounded"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpdate}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditTestCaseModal;
