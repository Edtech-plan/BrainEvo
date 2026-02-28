// AssignmentLayout.tsx
// Root layout for the Assignments feature — owns filter state and view switching.

import React, { useState } from "react";
import { theme } from "@/styles/theme";
import { useAssignments } from "../hooks/useAssignments";
import { Assignment } from "@/shared/types/assignment.types";
import { AlertCircle } from "lucide-react";
import { AssignmentList, AssignmentDetail, AssignmentStats } from "./index";

export default function AssignmentLayout() {
  const { assignments, loading, filter, setFilter, refresh, error } =
    useAssignments();
  const [selected, setSelected] = useState<Assignment | null>(null);

  const tabs: { id: typeof filter; label: string }[] = [
    { id: "ALL", label: "All Assignments" },
    { id: "PENDING", label: "To Do" },
    { id: "GRADED", label: "Completed" },
  ];

  // ── Detail view ──────────────────────────────────────────────────────
  if (selected) {
    return (
      <AssignmentDetail
        assignment={selected}
        onBack={() => setSelected(null)}
        onSuccess={() => {
          setSelected(null);
          refresh();
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
      {/* ── Page heading ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 800,
            color: theme.colors.textMain,
            margin: "0 0 6px",
            letterSpacing: "-0.025em",
          }}
        >
          Assignments
        </h1>
        <p
          style={{
            color: theme.colors.textSecondary,
            fontSize: "14px",
            maxWidth: "560px",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          Manage your coursework, track upcoming deadlines, and review graded
          performance.
        </p>
      </div>

      {/* ── Error banner ─────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.errorBg,
            border: `1px solid ${theme.colors.errorBorder}`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: theme.colors.errorText,
          }}
        >
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────────────── */}
      <AssignmentStats assignments={assignments} loading={loading} />

      {/* ── Filter tabs ──────────────────────────────────────────── */}
      <div
        style={
          {
            borderBottom: `1px solid ${theme.colors.border}`,
            marginBottom: "24px",
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
      >
        <div style={{ display: "flex", gap: "28px", minWidth: "min-content" }}>
          {tabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: "12px 0",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid ${theme.colors.primary}`
                    : "2px solid transparent",
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: `all ${theme.transitions.fast}`,
                  marginBottom: "-1px",
                  flexShrink: 0,
                  fontFamily: theme.font.sans,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = theme.colors.textMain;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = theme.colors.textSecondary;
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Assignment grid ──────────────────────────────────────── */}
      <AssignmentList
        assignments={assignments}
        loading={loading}
        onSelect={setSelected}
      />
    </div>
  );
}
