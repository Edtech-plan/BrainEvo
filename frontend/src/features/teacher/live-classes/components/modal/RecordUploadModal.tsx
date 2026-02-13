/**
 * RecordUploadModal Component
 * ------------------------------------------------
 * A simple input modal for teachers to paste a recording URL (YouTube/Zoom/Drive)
 * after a class is completed.
 *
 * Key Implementation Details:
 * - Uses z-[100] to ensure it overlays the dashboard sidebar/header.
 * - Disables submit button until a value is typed.
 */

import React, { useState } from "react";

interface RecordUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  isSubmitting: boolean;
  error: string | null; // Error state for failed uploads
}

export const RecordUploadModal: React.FC<RecordUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  return (
    // NOTE: High z-index (100) is critical here to sit above the layout sidebar
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Add Recording</h2>
        <p className="text-sm text-gray-500 mb-4">
          Paste the link to the cloud recording (YouTube, Zoom Cloud, Drive).
        </p>

        <input
          type="url"
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* --- Error Banner --- */}
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
            {error}
          </div>
        )}

        {/* --- Actions --- */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(url)}
            disabled={!url || isSubmitting}
            className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save URL"}
          </button>
        </div>
      </div>
    </div>
  );
};
