import React from "react";
import { theme } from "@/styles/theme";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type AttendanceStatus = "Present" | "Late" | "Absent";

interface AttendanceBadgeProps {
  status: AttendanceStatus;
}

const CONFIG: Record<
  AttendanceStatus,
  { bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  Present: {
    bg: theme.colors.successBg,
    text: theme.colors.successText,
    border: theme.colors.successBorder,
    icon: <CheckCircle2 size={11} />,
  },
  Late: {
    bg: theme.colors.warningBg,
    text: theme.colors.warningText,
    border: theme.colors.warningBorder,
    icon: <Clock size={11} />,
  },
  Absent: {
    bg: theme.colors.errorBg,
    text: theme.colors.errorText,
    border: theme.colors.errorBorder,
    icon: <XCircle size={11} />,
  },
};

export default function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const c = CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: theme.borderRadius.full,
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {c.icon}
      {status}
    </span>
  );
}
