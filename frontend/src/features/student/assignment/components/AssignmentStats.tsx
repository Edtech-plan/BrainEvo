// AssignmentStats.tsx
// Summary stat cards — pending, overdue, completed counts.
// FIX: All hardcoded light colours (#bfdbfe, #fecaca, #bbf7d0) replaced with
//      dark-theme equivalents from the theme tokens.
// FIX: primaryLight (light green d1fae5) → primaryFaint (rgba 10% tint).

import React from "react";
import { theme } from "@/styles/theme";
import { Assignment } from "@/shared/types/assignment.types";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export interface AssignmentStatsProps {
  assignments: Assignment[];
  loading?: boolean;
}

export default function AssignmentStats({
  assignments,
  loading,
}: AssignmentStatsProps) {
  // ── Loading skeleton ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <style>{`
          @keyframes statShimmer {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(100%);  }
          }
        `}</style>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: "96px",
                backgroundColor: theme.colors.bgCard,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg,
                  transparent 0%,
                  rgba(255,255,255,0.04) 50%,
                  transparent 100%)`,
                  animation: "statShimmer 1.4s infinite",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pending = assignments.filter((a) => a.status === "PENDING").length;
  const overdue = assignments.filter((a) => a.status === "OVERDUE").length;
  const completed = assignments.filter(
    (a) => a.status === "GRADED" || a.status === "SUBMITTED",
  ).length;

  // ── Stat card definitions — all dark-theme-safe ──────────────────
  // Previously used light hex bg (#bfdbfe, #fecaca, #bbf7d0) for icon wrappers.
  // Now uses theme semantic tokens which are already dark rgba values.
  const statCards = [
    {
      label: "Due Soon",
      value: pending,
      icon: <Clock size={18} color={theme.colors.primary} />,
      iconBg: theme.colors.primaryFaint,
      iconBorder: theme.colors.primaryGlow,
      valueColor: theme.colors.primary,
    },
    {
      label: "Missed",
      value: overdue,
      icon: <AlertCircle size={18} color={theme.colors.error} />,
      iconBg: theme.colors.errorBg,
      iconBorder: theme.colors.errorBorder,
      valueColor: theme.colors.error,
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={18} color={theme.colors.success} />,
      iconBg: theme.colors.successBg,
      iconBorder: theme.colors.successBorder,
      valueColor: theme.colors.success,
    },
  ];

  const css = `
    /* ── Mobile (default): single bar ──────────────────────────────── */
    .stats-container {
      display: flex;
      background-color: ${theme.colors.bgCard};
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.borderRadius.lg};
      overflow: hidden;
      box-shadow: ${theme.shadows.sm};
    }
    .stat-card {
      flex: 1;
      padding: 14px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 1px solid ${theme.colors.border};
    }
    .stat-card:last-child { border-right: none; }
    .stat-icon-desktop  { display: none; }
    .stat-icon-mobile   { display: block; margin-bottom: 6px; }

    /* ── Desktop: individual elevated cards ─────────────────────────── */
    @media (min-width: 640px) {
      .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        background-color: transparent;
        border: none;
        border-radius: 0;
        overflow: visible;
        box-shadow: none;
      }
      .stat-card {
        background-color: ${theme.colors.bgCard};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.lg};
        padding: 20px 24px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        box-shadow: ${theme.shadows.sm};
        transition: box-shadow ${theme.transitions.fast};
      }
      .stat-card:last-child { border-right: 1px solid ${theme.colors.border}; }
      .stat-card:hover { box-shadow: ${theme.shadows.card}; }
      .stat-icon-desktop {
        display: flex;
        width: 44px;
        height: 44px;
        border-radius: 11px;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .stat-icon-mobile { display: none; }
    }
  `;

  return (
    <div style={{ marginBottom: "28px" }}>
      <style>{css}</style>
      <div className="stats-container">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            {/* Mobile: small inline icon above number */}
            <div className="stat-icon-mobile">{stat.icon}</div>

            {/* Text block */}
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: theme.colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: stat.valueColor,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
            </div>

            {/* Desktop: icon box (dark bg, themed border) */}
            <div
              className="stat-icon-desktop"
              style={{
                backgroundColor: stat.iconBg,
                border: `1px solid ${stat.iconBorder}`,
              }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
