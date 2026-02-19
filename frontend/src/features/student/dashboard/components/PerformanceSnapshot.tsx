// src/features/student/dashboard/components/PerformanceSnapshot.tsx
import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import { useAssignments } from "@/features/student/assignment/hooks/useAssignments";
import { useDashboard } from "../hooks/useDashboard";
import { BarChart3, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function PerformanceSnapshot() {
  const { assignments, loading: al } = useAssignments();
  const { dashboardData, loading: dl } = useDashboard();
  const loading = al || dl;

  const onTimeRate = useMemo(() => {
    if (!assignments.length) return 0;
    return dashboardData?.completionRate ?? 90;
  }, [assignments, dashboardData]);

  const missed = useMemo(() => {
    const now = new Date();
    return assignments.filter((a) => a.dueDate && new Date(a.dueDate) < now)
      .length;
  }, [assignments]);

  const attendanceTrend = dashboardData?.attendanceRate
    ? dashboardData.attendanceRate > 85
      ? "up"
      : "down"
    : null;

  return (
    <div
      style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: "20px",
        boxShadow: theme.shadows.card,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-20px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BarChart3 size={17} color="#fff" />
        </div>
        <div>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: theme.colors.textMain,
              margin: 0,
            }}
          >
            Performance Snapshot
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: theme.colors.textMuted,
              margin: 0,
            }}
          >
            Submissions & attendance
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              height: "6px",
              background: theme.colors.bgHover,
              borderRadius: theme.borderRadius.full,
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: "80px",
                  background: theme.colors.bgHover,
                  borderRadius: theme.borderRadius.md,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div style={{ marginBottom: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                On-time Submissions
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.colors.textMain,
                }}
              >
                {onTimeRate}%
              </span>
            </div>
            <div
              style={{
                height: "5px",
                background: theme.colors.bgHover,
                borderRadius: theme.borderRadius.full,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${onTimeRate}%`,
                  background: theme.gradients.primary,
                  borderRadius: theme.borderRadius.full,
                  transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: theme.shadows.glowSm,
                }}
              />
            </div>
          </div>

          {/* Mini metric cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {/* Missed */}
            <div
              style={{
                padding: "14px",
                borderRadius: theme.borderRadius.md,
                background:
                  missed > 0 ? "rgba(248,81,73,0.07)" : "rgba(16,185,129,0.07)",
                border: `1px solid ${missed > 0 ? "rgba(248,81,73,0.15)" : "rgba(16,185,129,0.15)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "8px",
                }}
              >
                <AlertCircle
                  size={12}
                  color={missed > 0 ? theme.colors.error : theme.colors.success}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color:
                      missed > 0
                        ? theme.colors.errorText
                        : theme.colors.successText,
                  }}
                >
                  Missed
                </span>
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color:
                    missed > 0
                      ? theme.colors.errorText
                      : theme.colors.successText,
                  lineHeight: 1,
                }}
              >
                {missed}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.colors.textMuted,
                  marginTop: "4px",
                }}
              >
                deadlines
              </div>
            </div>

            {/* Attendance trend */}
            <div
              style={{
                padding: "14px",
                borderRadius: theme.borderRadius.md,
                background:
                  attendanceTrend === "up"
                    ? "rgba(16,185,129,0.07)"
                    : "rgba(245,158,11,0.07)",
                border: `1px solid ${attendanceTrend === "up" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)"}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "8px",
                }}
              >
                {attendanceTrend === "up" ? (
                  <TrendingUp size={12} color={theme.colors.success} />
                ) : (
                  <TrendingDown size={12} color={theme.colors.warning} />
                )}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color:
                      attendanceTrend === "up"
                        ? theme.colors.successText
                        : theme.colors.warningText,
                  }}
                >
                  Attendance
                </span>
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color:
                    attendanceTrend === "up"
                      ? theme.colors.successText
                      : theme.colors.warningText,
                }}
              >
                {attendanceTrend
                  ? attendanceTrend === "up"
                    ? "↑"
                    : "↓"
                  : "--"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: theme.colors.textMuted,
                  marginTop: "4px",
                }}
              >
                this week
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
