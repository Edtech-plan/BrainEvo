import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import {
  getEventsForDate,
  formatTime,
  isToday,
} from "../../utils/calendar.utils";
import type { LiveClass } from "@/shared/types";
import type { Assignment } from "@/shared/types";
import { Video, FileText, Clock } from "lucide-react";

interface DayViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (
    event: LiveClass | Assignment,
    type: "class" | "assignment",
  ) => void;
}

export default function DayView({
  currentDate,
  liveClasses,
  assignments,
  onDateClick,
  onEventClick,
}: DayViewProps) {
  const events = useMemo(() => {
    return getEventsForDate(currentDate, liveClasses, assignments);
  }, [currentDate, liveClasses, assignments]);

  const hourSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 12 ? (i === 0 ? 12 : i) : i - 12;
    const period = i < 12 ? "AM" : "PM";
    return { hour, period, fullHour: i };
  });

  const getEventPosition = (startTime: Date, endTime: Date) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;
    const top = startMinutes * 1;
    const height = duration * 1;
    return { top, height };
  };

  const allEvents = [
    ...events.liveClasses.map((lc) => ({
      ...lc,
      type: "class" as const,
      start: new Date(lc.scheduledAt),
      end: new Date(
        new Date(lc.scheduledAt).getTime() + (lc.duration || 60) * 60 * 1000,
      ),
    })),
    ...events.assignments.map((a) => ({
      ...a,
      type: "assignment" as const,
      start: new Date(a.dueDate!),
      end: new Date(new Date(a.dueDate!).getTime() + 60 * 60 * 1000),
    })),
  ].sort((a, b) => a.start.getTime() - b.start.getTime());

  const todayFlag = isToday(currentDate);

  const css = `
    @keyframes dvPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:0.4} }
    .dv-slot:hover { background: rgba(16,185,129,0.05) !important; }
    .dv-event {
      transition: all 0.15s ease !important;
    }
    .dv-event:hover {
      transform: scale(1.015) translateX(2px) !important;
      z-index: 20 !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45) !important;
    }
    .dv-scrollbar::-webkit-scrollbar { width: 5px; }
    .dv-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .dv-scrollbar::-webkit-scrollbar-thumb { background: ${theme.colors.border}; border-radius: 10px; }
  `;

  return (
    <div style={{ marginTop: "16px" }}>
      <style>{css}</style>

      {/* Date Header */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${todayFlag ? "rgba(16,185,129,0.3)" : theme.colors.border}`,
          padding: "12px 16px",
          marginBottom: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: todayFlag
            ? "0 0 0 1px rgba(16,185,129,0.08)"
            : theme.shadows.sm,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              flexShrink: 0,
              background: todayFlag
                ? theme.gradients.primary
                : `linear-gradient(135deg, ${theme.colors.bgHover}, ${theme.colors.bgCard})`,
              border: `1px solid ${todayFlag ? "transparent" : theme.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: todayFlag ? theme.shadows.glowSm : "none",
            }}
          >
            <Clock
              size={16}
              color={todayFlag ? "#fff" : theme.colors.textSecondary}
            />
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
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                margin: "1px 0 0",
                fontWeight: 500,
              }}
            >
              {allEvents.length === 0
                ? "No events scheduled"
                : `${allEvents.length} event${allEvents.length > 1 ? "s" : ""} today`}
            </p>
          </div>
        </div>
        {todayFlag && (
          <span
            style={{
              padding: "3px 10px",
              borderRadius: theme.borderRadius.full,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
              fontSize: "11px",
              fontWeight: 700,
              color: theme.colors.primary,
            }}
          >
            Today
          </span>
        )}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
          minHeight: "600px",
          maxHeight: "calc(100vh - 300px)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Time Column */}
        <div
          style={{
            width: "60px",
            flexShrink: 0,
            borderRight: `1px solid ${theme.colors.border}`,
            backgroundColor: `rgba(13,17,23,0.5)`,
            borderRadius: `${theme.borderRadius.lg} 0 0 ${theme.borderRadius.lg}`,
          }}
        >
          <div style={{ height: "60px", borderBottom: "transparent" }}></div>
          {hourSlots.slice(8, 18).map((slot, idx) => (
            <div key={idx} style={{ height: "60px", position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "8px",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: theme.colors.textMuted,
                  whiteSpace: "nowrap",
                }}
              >
                {slot.hour} {slot.period}
              </span>
            </div>
          ))}
        </div>

        {/* Events Area */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Grid Lines */}
          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {hourSlots.slice(8, 18).map((_, idx) => (
              <div
                key={idx}
                style={{
                  height: "60px",
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              ></div>
            ))}
          </div>

          {/* Clickable Time Slots */}
          {onDateClick && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "auto",
                zIndex: 5,
              }}
            >
              {hourSlots.slice(8, 18).map((slot, idx) => (
                <div
                  key={idx}
                  className="dv-slot"
                  onClick={() => {
                    const clickedDate = new Date(currentDate);
                    const hour = slot.fullHour;
                    const timeString = `${hour.toString().padStart(2, "0")}:00`;
                    onDateClick(clickedDate, timeString);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const clickedDate = new Date(currentDate);
                      const hour = slot.fullHour;
                      const timeString = `${hour.toString().padStart(2, "0")}:00`;
                      onDateClick(clickedDate, timeString);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select time slot ${slot.hour} ${slot.period}`}
                  style={{
                    position: "absolute",
                    top: `${idx * 60}px`,
                    left: 0,
                    right: 0,
                    height: "60px",
                    cursor: "pointer",
                    transition: `background-color ${theme.transitions.fast}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Current Time Indicator */}
          {isToday(currentDate) && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                borderTop: `2px solid ${theme.colors.error}`,
                zIndex: 20,
                left: 0,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                top: `${(new Date().getHours() * 60 + new Date().getMinutes() - 8 * 60) * 1}px`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: theme.colors.error,
                  position: "absolute",
                  left: "-4px",
                  animation: "dvPulse 1.5s ease-in-out infinite",
                }}
              ></div>
            </div>
          )}

          {/* Events */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {allEvents.map((event, idx) => {
              const position = getEventPosition(event.start, event.end);
              const isClass = event.type === "class";
              const eventColor = isClass
                ? {
                    bg: "rgba(16,185,129,0.12)",
                    border: theme.colors.primary,
                    text: theme.colors.successText,
                    textLight: theme.colors.success,
                    iconColor: theme.colors.success,
                  }
                : {
                    bg: "rgba(245,158,11,0.12)",
                    border: theme.colors.warning,
                    text: theme.colors.warningText,
                    textLight: theme.colors.accent,
                    iconColor: theme.colors.accent,
                  };

              return (
                <div
                  key={idx}
                  className="dv-event"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEventClick) {
                      onEventClick(event, isClass ? "class" : "assignment");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onEventClick) {
                        onEventClick(event, isClass ? "class" : "assignment");
                      }
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${event.title}`}
                  style={{
                    position: "absolute",
                    top: `${position.top}px`,
                    left: "10px",
                    right: "10px",
                    height: `${Math.max(position.height, 40)}px`,
                    backgroundColor: eventColor.bg,
                    borderLeft: `3px solid ${eventColor.border}`,
                    borderRadius: "0 6px 6px 0",
                    padding: "8px 10px",
                    cursor: "pointer",
                    border: `1px solid ${eventColor.border}25`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    pointerEvents: "auto",
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    role="presentation"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: eventColor.text,
                            margin: 0,
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "11px",
                            color: eventColor.textLight,
                            margin: "2px 0 0 0",
                            fontWeight: 500,
                          }}
                        >
                          {formatTime(event.start)} – {formatTime(event.end)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                        }}
                      >
                        {isClass && "meetingLink" in event && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "10px",
                              color: eventColor.textLight,
                              backgroundColor: `${eventColor.border}20`,
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            <Video size={9} />
                            <span>Virtual</span>
                          </div>
                        )}
                        {!isClass && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "10px",
                              color: eventColor.textLight,
                              backgroundColor: `${eventColor.border}20`,
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            <FileText size={9} />
                            <span>Due</span>
                          </div>
                        )}
                        {isClass &&
                          "instructor" in event &&
                          event.instructor && (
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                backgroundColor: theme.colors.primary,
                                border: `2px solid ${theme.colors.bgCard}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "8px",
                                fontWeight: 700,
                              }}
                            >
                              {event.instructor.name.charAt(0)}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {allEvents.length === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: theme.colors.bgHover,
                  border: `1px solid ${theme.colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={18} color={theme.colors.textMuted} />
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: theme.colors.textMuted,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                No events scheduled
              </p>
              {onDateClick && (
                <p
                  style={{
                    fontSize: "11px",
                    color: theme.colors.textMuted,
                    margin: 0,
                  }}
                >
                  Click a time slot to add one
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
