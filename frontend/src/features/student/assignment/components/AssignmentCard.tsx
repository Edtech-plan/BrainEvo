// AssignmentCard.tsx
// Individual assignment card shown in the grid.
// FIX: All status badge colours converted to dark-theme rgba tints.
// FIX: bgSurface → bgCard, primaryLight → primaryFaint for avatar.

import React from "react";
import { theme } from "@/styles/theme";
import { Assignment } from "../../../../shared/types/assignment.types";
import { Calendar, ChevronRight } from "lucide-react";

interface AssignmentCardProps {
  assignment: Assignment;
  onClick: () => void;
}

export default function AssignmentCard({
  assignment,
  onClick,
}: AssignmentCardProps) {
  const isOverdue = assignment.status === "OVERDUE";
  const isGraded = assignment.status === "GRADED";

  // ── Status badge — dark-theme rgba tints ──────────────────────────────
  // Previously used light mode hex values (#f0fdf4 etc.) that looked
  // washed-out / invisible on dark backgrounds.
  const getStatusBadge = () => {
    if (isGraded)
      return {
        label: "Graded",
        bg: theme.colors.successBg,
        color: theme.colors.successText,
        border: theme.colors.successBorder,
      };
    if (assignment.status === "SUBMITTED")
      return {
        label: "Submitted",
        bg: theme.colors.infoBg,
        color: theme.colors.infoText,
        border: theme.colors.infoBorder,
      };
    if (isOverdue)
      return {
        label: "Overdue",
        bg: theme.colors.errorBg,
        color: theme.colors.errorText,
        border: theme.colors.errorBorder,
      };
    // PENDING — amber
    return {
      label: "Pending",
      bg: theme.colors.warningBg,
      color: theme.colors.warningText,
      border: theme.colors.warningBorder,
    };
  };

  const badge = getStatusBadge();

  // Left-edge accent colour driven by status
  const accentColor = isGraded
    ? theme.colors.success
    : assignment.status === "SUBMITTED"
      ? theme.colors.info
      : isOverdue
        ? theme.colors.error
        : theme.colors.accent;

  return (
    <button
      onClick={onClick}
      style={{
        // bgCard lifts off bgMain — correct dark hierarchy
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        borderLeft: `3px solid ${accentColor}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        boxShadow: theme.shadows.sm,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = theme.shadows.card;
        // Use rgba instead of primaryLight (d1fae5 is a light colour)
        e.currentTarget.style.borderColor = `rgba(16,185,129,0.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadows.sm;
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      {/* ── Top meta row ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        {/* Subject pill */}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: theme.colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            backgroundColor: theme.colors.bgHover,
            padding: "5px 10px",
            borderRadius: "6px",
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {assignment.subject}
        </span>

        {/* Status badge — now dark-safe */}
        <div
          style={{
            padding: "4px 10px",
            borderRadius: "99px",
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {badge.label}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: "auto" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: theme.colors.textMain,
            marginBottom: "8px",
            lineHeight: "1.4",
            margin: "0 0 8px",
          }}
        >
          {assignment.title}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: isOverdue ? theme.colors.error : theme.colors.textSecondary,
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <Calendar size={14} />
          <span>
            {isGraded ? "Completed on " : "Due "}
            {new Date(assignment.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ── Footer — instructor + score/chevron ──────────────────────── */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Instructor avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              // primaryFaint is a dark-safe 10% tint — replaces light primaryLight
              backgroundColor: theme.colors.primaryFaint,
              border: `1px solid ${theme.colors.primaryGlow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: theme.colors.primary,
            }}
          >
            {assignment.instructorName.charAt(0)}
          </div>
          <span
            style={{
              fontSize: "13px",
              color: theme.colors.textSecondary,
              fontWeight: 500,
            }}
          >
            {assignment.instructorName}
          </span>
        </div>

        {/* Grade or navigate chevron */}
        {isGraded ? (
          <div
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: theme.colors.textMain,
            }}
          >
            {assignment.mySubmission?.grade}
            <span
              style={{
                fontSize: "12px",
                color: theme.colors.textSecondary,
                fontWeight: 500,
              }}
            >
              /{assignment.pointsTotal}
            </span>
          </div>
        ) : (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: theme.colors.bgHover,
              border: `1px solid ${theme.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.textSecondary,
            }}
          >
            <ChevronRight size={16} />
          </div>
        )}
      </div>
    </button>
  );
}
