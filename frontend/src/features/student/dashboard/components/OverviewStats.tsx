// src/features/student/dashboard/components/OverviewStats.tsx
import React from "react";
import { Clock, BookOpen, Award, TrendingUp } from "lucide-react";
import { theme } from "@/styles/theme";
import { useDashboard } from "../hooks/useDashboard";

const STATS = [
  {
    label: "Attendance",
    sublabel: "This semester",
    icon: Clock,
    color: theme.colors.success,
    colorFaint: "rgba(16,185,129,0.1)",
    colorBorder: "rgba(16,185,129,0.2)",
    getValue: (d: any) =>
      d?.attendanceRate ? `${Math.round(d.attendanceRate)}%` : "--",
  },
  {
    label: "Live Classes",
    sublabel: "Enrolled / Total",
    icon: BookOpen,
    color: theme.colors.info,
    colorFaint: "rgba(88,166,255,0.1)",
    colorBorder: "rgba(88,166,255,0.2)",
    getValue: (d: any) =>
      d ? `${d.totalEnrollments ?? 0}/${d.totalCourses ?? 0}` : "--/--",
  },
  {
    label: "Assignments",
    sublabel: "Completion rate",
    icon: Award,
    color: theme.colors.accent,
    colorFaint: "rgba(245,158,11,0.1)",
    colorBorder: "rgba(245,158,11,0.2)",
    getValue: (d: any) =>
      d?.completionRate ? `${Math.round(d.completionRate)}%` : "--",
  },
  {
    label: "Performance",
    sublabel: "Overall score",
    icon: TrendingUp,
    color: "#a78bfa",
    colorFaint: "rgba(167,139,250,0.1)",
    colorBorder: "rgba(167,139,250,0.2)",
    getValue: (d: any) =>
      d?.completionRate ? `${Math.round(d.completionRate)}%` : "--",
  },
];

export default function OverviewStats() {
  const { dashboardData, loading } = useDashboard();

  return (
    <>
      <style>{`
        .stats-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:640px)  { .stats-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width:1024px) { .stats-grid { grid-template-columns:repeat(4,1fr); } }
        .stat-card { transition: transform 200ms ease, box-shadow 200ms ease !important; }
        .stat-card:hover { transform:translateY(-3px) !important; box-shadow:0 12px 32px rgba(0,0,0,0.45) !important; }
      `}</style>

      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="stat-card"
            style={{
              background: theme.colors.bgCard,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: theme.shadows.card,
              cursor: "default",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle top-left color splash */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-20px",
                left: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${s.colorFaint} 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />

            {/* Top row — label + icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: theme.colors.textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </span>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: s.colorFaint,
                  border: `1px solid ${s.colorBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {loading ? (
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: theme.colors.bgHover,
                    }}
                  />
                ) : (
                  <s.icon size={17} color={s.color} />
                )}
              </div>
            </div>

            {/* Value */}
            {loading ? (
              <div
                style={{
                  height: "32px",
                  width: "55%",
                  background: theme.colors.bgHover,
                  borderRadius: "6px",
                }}
              />
            ) : (
              <div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: theme.colors.textMain,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {s.getValue(dashboardData)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.colors.textMuted,
                    marginTop: "4px",
                    fontWeight: 500,
                  }}
                >
                  {s.sublabel}
                </div>
              </div>
            )}

            {/* Bottom colored line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${s.color}, transparent)`,
                opacity: 0.5,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
