/**
 * CreateSessionModal Component
 * ------------------------------------------------
 * A modal form allowing teachers to schedule new live classes.
 *
 * Features:
 * - Dynamic Batch Selection
 * - Form Validation (Required fields)
 * - Strict Error Handling (Displays backend errors)
 * - Loading states during submission
 */

import React, { useState } from "react";
import { CreateSessionPayload } from "../../../../../shared/types/live.types";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSessionPayload) => void;
  isSubmitting: boolean;
  error: string | null; // Error message from the hook/service layer
}

// Mock Batches Configuration
// TODO: In a real implementation, replace this with a `useBatches()` hook fetch.
const BATCH_OPTIONS = [
  { id: "b-alpha", name: "Physics - Batch Alpha" },
  { id: "b-beta", name: "Maths - JEE Mains" },
  { id: "b-gamma", name: "Chemistry - Class XII" },
  { id: "b-delta", name: "Biology - NEET" },
];

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  // Local form state
  const [form, setForm] = useState<CreateSessionPayload>({
    batchId: "b-alpha", // Default selection
    topic: "",
    description: "",
    startTime: "",
    durationMinutes: 60, // Default duration: 1 hour
    meetingLink: "",
  });

  // Early return if modal is hidden (prevents unnecessary rendering)
  if (!isOpen) return null;

  /**
   * Handles form submission.
   * Prevents default browser behavior and performs basic client-side validation.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // strict check: ensure required fields are present
    if (!form.topic || !form.startTime || !form.meetingLink) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Schedule Live Class
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* --- Batch Selection --- */}
          <div>
            <label
              htmlFor="batch-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Batch
            </label>
            <select
              id="batch-select"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={form.batchId}
              onChange={(e) => setForm({ ...form, batchId: e.target.value })}
            >
              {BATCH_OPTIONS.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* --- Topic Input --- */}
          <div>
            <label
              htmlFor="topic-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <input
              id="topic-input"
              type="text"
              required
              placeholder="e.g. Thermodynamics L-01"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>

          {/* --- Time & Duration Grid --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Time
              </label>
              <input
                id="start-time-input"
                type="datetime-local"
                required
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="duration-input"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (min)
              </label>
              <input
                id="duration-input"
                type="number"
                required
                min="15"
                step="15"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* --- Meeting Link --- */}
          <div>
            <label
              htmlFor="meeting-link-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Meeting Link
            </label>
            <input
              id="meeting-link-input"
              type="url"
              required
              placeholder="https://zoom.us/..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              value={form.meetingLink}
              onChange={(e) =>
                setForm({ ...form, meetingLink: e.target.value })
              }
            />
          </div>

          {/* --- Error Banner (Strict Error Handling) --- */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* --- Action Buttons --- */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Scheduling..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
