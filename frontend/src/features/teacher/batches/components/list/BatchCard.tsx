import React, { useState } from "react";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { Batch } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../../styles/theme";

export const BatchCard = ({
  batch,
  onClick,
}: {
  batch: Batch;
  onClick: (id: string) => void;
}) => {
  const [hover, setHover] = useState(false);

  // Helper to format schedule string (e.g., "Mon, Wed • 10:00 - 11:30")
  const formatSchedule = () => {
    const days = batch.schedule.days.join(", ");
    return `${days} • ${batch.schedule.startTime}`;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(batch.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(batch.id);
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="p-6 transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: theme.colors.bgSurface,
        border: `1px solid ${hover ? theme.colors.primary : theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: hover ? theme.shadows.lg : theme.shadows.sm,
      }}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <span
            className="px-2.5 py-1 inline-block mb-3 text-[11px] font-bold uppercase tracking-wider rounded-md"
            style={{
              backgroundColor:
                batch.status === "active"
                  ? theme.colors.successBg
                  : theme.colors.bgHover,
              color:
                batch.status === "active"
                  ? theme.colors.successText
                  : theme.colors.textSecondary,
            }}
          >
            {batch.status}
          </span>
          <h3
            className="text-lg font-bold leading-tight"
            style={{ color: theme.colors.textMain }}
          >
            {batch.name}
          </h3>
        </div>
        <div
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{
            backgroundColor: hover
              ? theme.colors.primary
              : theme.colors.bgHover,
            color: hover ? "#fff" : theme.colors.textSecondary,
          }}
        >
          <ArrowRight size={16} />
        </div>
      </div>
      <div
        className="space-y-2 pt-4 border-t"
        style={{ borderColor: theme.colors.bgHover }}
      >
        <div
          className="flex items-center text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          <Calendar size={14} className="mr-2 opacity-70" /> {formatSchedule()}
        </div>
        <div
          className="flex items-center text-sm"
          style={{ color: theme.colors.textSecondary }}
        >
          <Users size={14} className="mr-2 opacity-70" /> {batch.studentCount}{" "}
          Students
        </div>
      </div>
    </div>
  );
};
