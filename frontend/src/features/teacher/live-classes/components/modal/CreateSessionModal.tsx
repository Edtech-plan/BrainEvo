/**
 * CreateSessionModal Component
 * ------------------------------------------------
 * A modal form allowing teachers to schedule new live classes.
 * Updated to match the unified `CreateLiveClassPayload` schema.
 */

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { CreateLiveClassPayload } from "@/shared/types/liveClass.types"; // Unified Import

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLiveClassPayload) => void;
  isSubmitting: boolean;
  error: string | null;
}

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
  // Local state aligned with new schema
  const [form, setForm] = useState<CreateLiveClassPayload>({
    courseId: "b-alpha",
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60,
    meetingLink: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledAt || !form.meetingLink) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Schedule Live Class
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Batch/Course Selection */}
          <div>
            <label
              htmlFor="courseId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Batch
            </label>
            <select
              id="courseId"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            >
              {BATCH_OPTIONS.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic -> Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Topic
            </label>
            <input
              type="text"
              required
              id="title"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="scheduledAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                required
                id="scheduledAt"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration (min)
              </label>
              <input
                type="number"
                required
                id="duration"
                min="15"
                step="15"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="meetingLink"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Meeting Link
            </label>
            <input
              type="url"
              required
              id="meetingLink"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              value={form.meetingLink}
              onChange={(e) =>
                setForm({ ...form, meetingLink: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

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
