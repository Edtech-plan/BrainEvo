// AssignmentList.tsx
// Responsive grid of AssignmentCard components with loading skeletons and empty state.

import React from "react";
import { theme } from "@/styles/theme";
import { Assignment } from "@/shared/types/assignment.types";
import { FolderOpen } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

export interface AssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  onSelect: (a: Assignment) => void;
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
  gap: "16px",
};

export default function AssignmentList({
  assignments,
  loading,
  onSelect,
}: AssignmentListProps) {
  // ── Loading skeleton ────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={gridStyle}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "220px",
              // bgCard — correct dark elevation
              backgroundColor: theme.colors.bgCard,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer sweep */}
            <style>{`
              @keyframes shimmer {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(100%);  }
              }
            `}</style>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg,
                transparent 0%,
                rgba(255,255,255,0.04) 50%,
                transparent 100%)`,
                animation: "shimmer 1.4s infinite",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────
  if (assignments.length === 0) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          padding: "60px 20px",
          borderRadius: theme.borderRadius.lg,
          textAlign: "center",
          border: `1px dashed ${theme.colors.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: theme.colors.bgHover,
            border: `1px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FolderOpen size={22} color={theme.colors.textMuted} />
        </div>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: theme.colors.textMain,
            margin: 0,
          }}
        >
          All caught up!
        </p>
        <p
          style={{
            color: theme.colors.textSecondary,
            margin: 0,
            fontSize: "14px",
          }}
        >
          No assignments found in this category.
        </p>
      </div>
    );
  }

  // ── Assignment grid ─────────────────────────────────────────────────
  return (
    <div style={{ animation: "alFadeIn 0.3s ease" }}>
      <style>{`
        @keyframes alFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
      <div style={gridStyle}>
        {assignments.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            onClick={() => onSelect(a)}
          />
        ))}
      </div>
    </div>
  );
}
