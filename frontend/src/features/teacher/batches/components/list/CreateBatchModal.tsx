import React, { useState } from "react";
import { X } from "lucide-react";
import { CreateBatchPayload } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../../styles/theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const CreateBatchModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (d: CreateBatchPayload) => Promise<void>;
}) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !startDate ||
      selectedDays.length === 0 ||
      !startTime ||
      !endTime
    )
      return;
    setSubmitting(true);
    await onSubmit({
      name,
      startDate,
      schedule: { days: selectedDays, startTime, endTime },
    });
    setSubmitting(false);
    onClose();
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgMain,
    outline: "none",
    color: theme.colors.textMain,
    fontSize: "14px",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
        style={{ backgroundColor: theme.colors.bgSurface }}
      >
        <div
          className="p-5 md:p-6 border-b flex justify-between items-center"
          style={{ borderColor: theme.colors.border }}
        >
          <h2
            className="text-lg md:text-xl font-bold"
            style={{ color: theme.colors.textMain }}
          >
            Create New Cohort
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} color={theme.colors.textSecondary} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
          <div>
            <label
              htmlFor="batch-name"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: theme.colors.textSecondary }}
            >
              Batch Name
            </label>
            <input
              id="batch-name"
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics Class XI - A"
              required
            />
          </div>

          <div>
            <label
              htmlFor="weekly-schedule-days"
              className="block text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: theme.colors.textSecondary }}
            >
              Weekly Schedule
            </label>

            {/* Responsive Days Grid - Flex wrap for mobile */}
            <div
              id="weekly-schedule-days"
              className="flex flex-wrap gap-2 mb-4"
              role="group"
              aria-label="Weekly Schedule"
            >
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className="flex-1 min-w-[3rem] py-2 rounded-lg text-sm font-bold transition-all border"
                    style={{
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.bgHover,
                      color: isSelected ? "#fff" : theme.colors.textSecondary,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="start-time"
                  className="block text-xs mb-1 font-semibold"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="start-time"
                    style={inputStyle}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="end-time"
                  className="block text-xs mb-1 font-semibold"
                  style={{ color: theme.colors.textSecondary }}
                >
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="end-time"
                    style={inputStyle}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="start-date"
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: theme.colors.textSecondary }}
            >
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              style={inputStyle}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div
            className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t"
            style={{ borderColor: theme.colors.bgHover }}
          >
            <button
              type="button"
              onClick={onClose}
              className="w-full md:flex-1 py-3 font-bold rounded-lg"
              style={{
                backgroundColor: theme.colors.bgHover,
                color: theme.colors.textMain,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:flex-1 py-3 font-bold rounded-lg flex justify-center items-center gap-2"
              style={{ backgroundColor: theme.colors.primary, color: "#fff" }}
            >
              {submitting ? "Creating..." : <>Create Batch</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
