import React from "react";
import { X } from "lucide-react"; // Close Icon

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  newContent: string;
  setNewContent: (content: string) => void;
  handleSaveEdit: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  handleSaveEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-xl"
        >
          <X />
        </button>
        <h3 className="text-3xl font-semibold text-white mb-6">
          Edit Test Case
        </h3>

        <div>
          <label className="block text-sm text-white mb-2">Title</label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-4 mt-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter test case title"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm text-white mb-2">Content</label>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-4 mt-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            rows={8} // Increase the number of rows for more height
            placeholder="Enter test case content"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-6">
          <button
            onClick={handleSaveEdit}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
