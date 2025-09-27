import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // hide if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {children}
        </div>

        {/* Footer (optional) */}
        <div className="flex justify-end gap-2 mt-4 border-t pt-3">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
