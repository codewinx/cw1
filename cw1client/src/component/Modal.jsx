import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // hide if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500"
          >
            ✖
          </button>
        </div>

        {/* Form or any content */}
        {children}
      </div>
    </div>
  );
}
