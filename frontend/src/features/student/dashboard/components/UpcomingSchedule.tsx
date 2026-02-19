// src/features/student/dashboard/components/UpcomingSchedule.tsx
import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import { useLiveClasses } from "@/features/student/live-classes";
import { useAssignments } from "@/features/student/assignment/hooks/useAssignments";
import { CalendarClock, Video, FileText, ArrowRight } from "lucide-react";

export default function UpcomingSchedule() {
  const { liveClasses, loading: lc } = useLiveClasses();
  const { assignments, loading: al } = useAssignments();
  const loading = lc || al;

  const events = useMemo(() => {
    const list: Array<{
      title: string;
      time: string;
      type: "class" | "deadline";
    }> = [];
    const now = new Date();
    const week = 7 * 24 * 60 * 60 * 1000;

    liveClasses.forEach((c) => {
      const d = new Date(c.scheduledAt);
      if (d > now && d.getTime() - now.getTime() <= week) {
        const isToday = d.toDateString() === now.toDateString();
        list.push({
          title: c.title,
          type: "class",
          time: isToday
            ? `Today · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
            : d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
        });
      }
    });

    assignments.forEach((a) => {
      if (!a.dueDate) return;
      const d = new Date(a.dueDate);
      if (d > now && d.getTime() - now.getTime() <= week) {
        const isToday = d.toDateString() === now.toDateString();
        const isTomorrow =
          d.toDateString() ===
          new Date(now.getTime() + 86400000).toDateString();
        list.push({
          title: a.title,
          type: "deadline",
          time: isToday
            ? `Today · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
            : isTomorrow
              ? `Tomorrow · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
              : d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
        });
      }
    });

    return list
      .sort(
        (a, b) =>
          (a.time.includes("Today") ? 0 : a.time.includes("Tomorrow") ? 1 : 2) -
          (b.time.includes("Today") ? 0 : b.time.includes("Tomorrow") ? 1 : 2),
      )
      .slice(0, 5);
  }, [liveClasses, assignments]);

  return (
    <div
      style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: theme.shadows.card,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarClock size={17} color="#fff" />
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
              Upcoming Schedule
            </h2>
            <p
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                margin: 0,
              }}
            >
              Next 7 days
            </p>
          </div>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: theme.colors.primary,
            border: "none",
            background: "none",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "12px",
            padding: 0,
          }}
        >
          View All <ArrowRight size={11} />
        </button>
      </div>

      {/* Events */}
      <div style={{ flex: 1 }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "14px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background: theme.colors.bgHover,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: "11px",
                    width: "70%",
                    background: theme.colors.bgHover,
                    borderRadius: "4px",
                    marginBottom: "6px",
                  }}
                />
                <div
                  style={{
                    height: "9px",
                    width: "40%",
                    background: theme.colors.bgHover,
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 0",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: theme.colors.bgHover,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CalendarClock size={20} color={theme.colors.textMuted} />
            </div>
            <p
              style={{
                color: theme.colors.textMuted,
                fontSize: "13px",
                margin: 0,
              }}
            >
              No upcoming events this week
            </p>
          </div>
        ) : (
          events.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "12px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background:
                    e.type === "deadline"
                      ? "rgba(248,81,73,0.12)"
                      : "rgba(16,185,129,0.12)",
                  border: `1px solid ${e.type === "deadline" ? "rgba(248,81,73,0.2)" : "rgba(16,185,129,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {e.type === "class" ? (
                  <Video size={12} color={theme.colors.primary} />
                ) : (
                  <FileText size={12} color={theme.colors.error} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: "13px",
                    margin: 0,
                    color: theme.colors.textMain,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: theme.colors.textMuted,
                    margin: "3px 0 0",
                  }}
                >
                  {e.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
