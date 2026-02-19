// src/features/student/calendar/components/views/MonthView.tsx
// Renders the monthly calendar grid with event chips.
// Fixes: overflow clipping so events never bleed outside cells.

import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import {
  getDaysInMonth,
  getEventsForDate,
  isToday,
} from "../../utils/calendar.utils";
import type { LiveClass } from "@/shared/types";
import type { Assignment } from "@/shared/types";
import { Video, FileText } from "lucide-react";

interface MonthViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (
    event: LiveClass | Assignment,
    type: "class" | "assignment",
  ) => void;
}

export default function MonthView({
  currentDate,
  liveClasses,
  assignments,
  onDateClick,
  onEventClick,
}: MonthViewProps) {
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const dayEvents = useMemo(() => {
    return days.map((day) => getEventsForDate(day, liveClasses, assignments));
  }, [days, liveClasses, assignments]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Returns dark-theme tinted colors per event type
  const getEventColor = (type: "class" | "assignment") => {
    if (type === "class") {
      return {
        bg: "rgba(16,185,129,0.12)",
        border: theme.colors.primary,
        text: theme.colors.successText,
      };
    }
    return {
      bg: "rgba(245,158,11,0.12)",
      border: theme.colors.warning,
      text: theme.colors.warningText,
    };
  };

  const css = `
    /* ── Grid wrapper — gap of 1px acts as the border between cells ── */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      background-color: ${theme.colors.border};
      overflow: hidden; /* prevents any bleed outside the grid */
    }

    /* ── Individual cell ─────────────────────────────────────────────── */
    .calendar-cell {
      background-color: ${theme.colors.bgCard};
      min-height: 100px;
      padding: 8px;
      transition: background-color ${theme.transitions.fast};
      /* CRITICAL: clips children that would overflow the cell boundary */
      overflow: hidden;
      /* CRITICAL: allows flex/grid children to shrink below content size */
      min-width: 0;
      box-sizing: border-box;
    }
    .calendar-cell:hover {
      background-color: ${theme.colors.bgHover} !important;
    }

    /* ── Inactive (prev/next month) cells ────────────────────────────── */
    .calendar-cell-inactive {
      background-color: rgba(13,17,23,0.65) !important;
      cursor: default !important;
    }
    .calendar-cell-inactive:hover {
      background-color: rgba(13,17,23,0.65) !important;
    }

    /* ── Event chip ──────────────────────────────────────────────────── */
    .mv-event {
      font-size: 11px;
      padding: 3px 7px;
      border-radius: 4px;
      border-left: 2px solid;
      font-weight: 600;
      cursor: pointer;
      transition: all ${theme.transitions.fast};
      display: flex;
      align-items: center;
      gap: 4px;
      /* CRITICAL: never grow wider than the parent cell */
      max-width: 100%;
      width: 100%;
      box-sizing: border-box;
      /* CRITICAL: truncate overflowing text */
      overflow: hidden;
    }
    .mv-event:hover {
      transform: translateX(2px);
      filter: brightness(1.15);
    }

    /* ── Week day header ─────────────────────────────────────────────── */
    .mv-week-header {
      padding: 10px 4px;
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${theme.colors.textSecondary};
    }

    /* ── Mobile breakpoints ──────────────────────────────────────────── */
    @media (max-width: 640px) {
      .calendar-cell    { min-height: 56px !important; padding: 4px 3px !important; }
      .mv-event         { display: none !important; }  /* hide text chips on mobile */
      .mv-dot-row       { display: flex !important; }  /* show dot indicators instead */
      .mv-week-header   { font-size: 9px !important; padding: 6px 2px !important; letter-spacing: 0 !important; }
    }
    @media (max-width: 380px) {
      .calendar-cell { min-height: 44px !important; padding: 3px 2px !important; }
    }
  `;

  return (
    <div style={{ marginTop: "16px" }}>
      <style>{css}</style>

      {/* ── Month label ──────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: "10px 16px",
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: theme.shadows.sm,
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: theme.colors.textMain,
            margin: 0,
          }}
        >
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      {/* ── Main calendar card ───────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
          overflow: "hidden" /* clips the grid gap bleed at rounded corners */,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Week day header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: "rgba(13,17,23,0.55)",
          }}
        >
          {weekDays.map((day, idx) => (
            <div key={idx} className="mv-week-header">
              {day}
            </div>
          ))}
        </div>

        {/* ── Calendar day grid ────────────────────────────────────── */}
        <div className="calendar-grid" style={{ flex: 1 }}>
          {days.map((day, idx) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTodayDate = isToday(day);
            const ev = dayEvents[idx];

            // Merge classes + assignments; cap display at 3
            const allEvents = [
              ...ev.liveClasses.map((lc) => ({
                ...lc,
                type: "class" as const,
              })),
              ...ev.assignments.map((a) => ({
                ...a,
                type: "assignment" as const,
              })),
            ];
            const visibleEvents = allEvents.slice(0, 3);
            const hiddenCount = allEvents.length - 3;

            return (
              <div
                key={idx}
                className={`calendar-cell${!isCurrentMonth ? " calendar-cell-inactive" : ""}`}
                style={{
                  // Today gets a subtle green tint + green border ring
                  backgroundColor: isTodayDate
                    ? "rgba(16,185,129,0.07)"
                    : undefined,
                  border: isTodayDate
                    ? `1.5px solid rgba(16,185,129,0.3)`
                    : undefined,
                  cursor: onDateClick && isCurrentMonth ? "pointer" : "default",
                  position: "relative",
                }}
                onClick={(e) => {
                  if (onDateClick && isCurrentMonth) {
                    e.stopPropagation();
                    onDateClick(day);
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" || e.key === " ") &&
                    onDateClick &&
                    isCurrentMonth
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    onDateClick(day);
                  }
                }}
                role={onDateClick && isCurrentMonth ? "button" : undefined}
                tabIndex={onDateClick && isCurrentMonth ? 0 : undefined}
                aria-label={
                  onDateClick && isCurrentMonth
                    ? `Select date ${day.toLocaleDateString()}`
                    : undefined
                }
              >
                {/* ── Date number ──────────────────────────────────── */}
                <div
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {isTodayDate ? (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: theme.gradients.primary,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        boxShadow: theme.shadows.glowSm,
                        flexShrink: 0,
                      }}
                    >
                      {day.getDate()}
                    </div>
                  ) : (
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: isCurrentMonth ? 500 : 400,
                        color: isCurrentMonth
                          ? theme.colors.textMain
                          : theme.colors.textMuted,
                        flexShrink: 0,
                      }}
                    >
                      {day.getDate()}
                    </span>
                  )}
                </div>

                {/* ── Mobile: coloured dot indicators (hidden on desktop) ── */}
                {allEvents.length > 0 && (
                  <div
                    className="mv-dot-row"
                    style={{
                      display: "none",
                      gap: "3px",
                      flexWrap: "wrap",
                      marginBottom: "2px",
                    }}
                  >
                    {allEvents.slice(0, 3).map((e, i) => (
                      <span
                        key={i}
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background:
                            e.type === "class"
                              ? theme.colors.primary
                              : theme.colors.accent,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* ── Desktop: event chips ─────────────────────────── */}
                {/* Container must also have overflow+minWidth to contain chips */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                    overflow: "hidden" /* clips chips at the column boundary */,
                    minWidth: 0 /* allows flex children to shrink */,
                  }}
                >
                  {visibleEvents.map((event, eventIdx) => {
                    const colors = getEventColor(event.type);
                    return (
                      <div
                        key={eventIdx}
                        className="mv-event"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEventClick) onEventClick(event, event.type);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onEventClick) onEventClick(event, event.type);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${event.title}`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border,
                        }}
                        title={event.title}
                      >
                        {/* Icon */}
                        {event.type === "class" ? (
                          <Video size={8} style={{ flexShrink: 0 }} />
                        ) : (
                          <FileText size={8} style={{ flexShrink: 0 }} />
                        )}
                        {/* Title — flex:1 + minWidth:0 = will ellipsis instead of overflow */}
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {event.title}
                        </span>
                      </div>
                    );
                  })}

                  {/* Overflow count badge */}
                  {hiddenCount > 0 && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: theme.colors.textMuted,
                        fontWeight: 600,
                        paddingLeft: "4px",
                      }}
                    >
                      +{hiddenCount} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Legend ───────────────────────────────────────────────── */}
        <div
          style={{
            padding: "10px 20px",
            backgroundColor: "rgba(13,17,23,0.45)",
            borderTop: `1px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {[
            { color: theme.colors.primary, label: "Live Class" },
            { color: theme.colors.accent, label: "Assignment" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: "11px",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
