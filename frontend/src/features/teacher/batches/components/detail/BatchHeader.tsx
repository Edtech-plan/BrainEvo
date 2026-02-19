import React from "react";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { Batch, BatchStats } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../../styles/theme";

export const BatchHeader = ({
  batch,
  stats,
  onBack,
}: {
  batch: Batch;
  stats: BatchStats | null;
  onBack: () => void;
}) => {
  const timeString = `${batch.schedule.days.join(", ")} • ${batch.schedule.startTime} - ${batch.schedule.endTime}`;

  return (
    <div className="mb-6 md:mb-8">
      <button
        onClick={onBack}
        className="flex items-center text-sm mb-4 md:mb-6 hover:opacity-80 transition py-2"
        style={{ color: theme.colors.textSecondary }}
      >
        <ArrowLeft size={16} className="mr-1.5" /> Back to all batches
      </button>

      {/* Responsive Container: Stack on mobile, Row on desktop */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="w-full">
          <h1
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ color: theme.colors.textMain }}
          >
            {batch.name}
          </h1>

          <div
            className="flex flex-wrap items-center gap-3 md:gap-5 mt-3 text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <Clock size={14} className="text-indigo-500" /> {timeString}
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
              <Users size={14} className="text-indigo-500" />{" "}
              {batch.studentCount} Students
            </span>
            <span
              className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide"
              style={{
                backgroundColor: theme.colors.successBg,
                color: theme.colors.successText,
              }}
            >
              {batch.status}
            </span>
          </div>
        </div>

        {stats && (
          // FIX: 'grid' for Mobile (2 cols), 'flex' for Desktop (Row)
          <div className="grid grid-cols-2 w-full lg:flex lg:w-auto gap-4">
            {[
              {
                label: "Attendance",
                val: stats.avgAttendance,
                col: theme.colors.primary,
              },
              {
                label: "Performance",
                val: stats.avgPerformance,
                col: theme.colors.success,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 md:p-4 rounded-xl border shadow-sm min-w-[130px] flex-1 lg:flex-none"
                style={{
                  backgroundColor: theme.colors.bgSurface,
                  borderColor: theme.colors.border,
                }}
              >
                <div
                  className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {s.label}
                </div>
                <div
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: s.col }}
                >
                  {s.val}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
