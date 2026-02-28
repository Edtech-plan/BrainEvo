import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import {
  getWeekDays,
  getEventsForDate,
  formatTime,
  isToday,
} from "../../utils/calendar.utils";
import type { LiveClass } from "@/shared/types";
import type { Assignment } from "@/shared/types";
import { Video, FileText } from "lucide-react";

interface WeekViewProps {
  currentDate: Date;
  liveClasses: LiveClass[];
  assignments: Assignment[];
  onDateClick?: (date: Date, time?: string) => void;
  onEventClick?: (
    event: LiveClass | Assignment,
    type: "class" | "assignment",
  ) => void;
}

export default function WeekView({
  currentDate,
  liveClasses,
  assignments,
  onDateClick,
  onEventClick,
}: WeekViewProps) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const weekEvents = useMemo(() => {
    return weekDays.map((day) =>
      getEventsForDate(day, liveClasses, assignments),
    );
  }, [weekDays, liveClasses, assignments]);

  const hourSlots = Array.from({ length: 10 }, (_, i) => i + 8);

  const getEventPosition = (startTime: Date, dayIndex: number) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const top = (startMinutes - 8 * 60) * (50 / 60);
    return { top, dayIndex };
  };

  const getEventHeight = (startTime: Date, endTime: Date) => {
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;
    return (duration / 60) * 50;
  };

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const weekRange = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const css = `
    .wv-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .wv-inner  { min-width: 600px; }
    .wv-slot { transition: background ${theme.transitions.fast} !important; }
    .wv-slot:hover { background: rgba(16,185,129,0.05) !important; }
    .wv-event { transition: all 0.15s ease !important; }
    .wv-event:hover { transform: scale(1.03) !important; z-index: 20 !important; box-shadow: 0 6px 20px rgba(0,0,0,0.45) !important; }
    .wv-wrapper::-webkit-scrollbar { height: 5px; }
    .wv-wrapper::-webkit-scrollbar-track { background: transparent; }
    .wv-wrapper::-webkit-scrollbar-thumb { background: ${theme.colors.border}; border-radius: 10px; }
  `;

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ marginTop: "16px" }}>
      <style>{css}</style>

      {/* Week Header */}
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
          {weekRange}
        </h2>
        <span style={{ fontSize: "11px", color: theme.colors.textMuted }}>
          Scroll to view all days →
        </span>
      </div>

      {/* Calendar Grid */}
      <div
        className="wv-wrapper"
        style={{
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
          overflow: "hidden",
        }}
      >
        <div className="wv-inner">
          {/* Day Headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50px repeat(7, 1fr)",
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor: `rgba(13,17,23,0.6)`,
            }}
          >
            <div
              style={{
                padding: "10px",
                borderRight: `1px solid ${theme.colors.border}`,
              }}
            ></div>
            {weekDays.map((day, idx) => {
              const isTodayDate = isToday(day);
              return (
                <div
                  key={idx}
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    borderRight:
                      idx < 6 ? `1px solid ${theme.colors.border}` : "none",
                    minWidth: "80px",
                    background: isTodayDate
                      ? "rgba(16,185,129,0.06)"
                      : "transparent",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: theme.colors.textSecondary,
                      margin: "0 0 4px",
                    }}
                  >
                    {dayLabels[idx]}
                  </p>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      margin: "0 auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: isTodayDate
                        ? theme.gradients.primary
                        : "transparent",
                      color: isTodayDate ? "#fff" : theme.colors.textMain,
                      fontWeight: 700,
                      fontSize: "14px",
                      boxShadow: isTodayDate ? theme.shadows.glowSm : "none",
                    }}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div
            style={{
              flex: 1,
              position: "relative",
              minHeight: "500px",
              maxHeight: "calc(100vh - 300px)",
              backgroundColor: theme.colors.bgCard,
            }}
          >
            {/* Background Grid Columns */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "50px repeat(7, 1fr)",
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
            >
              <div
                style={{
                  borderRight: `1px solid ${theme.colors.border}`,
                  backgroundColor: `rgba(13,17,23,0.4)`,
                }}
              ></div>
              {weekDays.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    borderRight:
                      idx < 6 ? `1px solid ${theme.colors.border}` : "none",
                    background: isToday(weekDays[idx])
                      ? "rgba(16,185,129,0.03)"
                      : "transparent",
                  }}
                ></div>
              ))}
            </div>

            {/* Time Slots */}
            <div style={{ position: "relative", zIndex: 0 }}>
              {hourSlots.map((hour, hourIdx) => (
                <div
                  key={hourIdx}
                  style={{
                    height: "50px",
                    borderBottom: `1px solid ${theme.colors.border}`,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      textAlign: "right",
                      paddingRight: "6px",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: theme.colors.textMuted,
                      position: "relative",
                      top: "-7px",
                    }}
                  >
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                          ? "12 PM"
                          : `${hour - 12} PM`}
                  </div>
                </div>
              ))}
            </div>

            {/* Clickable Time Slots */}
            {onDateClick && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  left: "50px",
                  width: "calc(100% - 50px)",
                  height: "100%",
                  pointerEvents: "auto",
                  zIndex: 5,
                }}
              >
                {weekDays.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    style={{
                      position: "absolute",
                      left: `${(dayIdx / 7) * 100}%`,
                      width: `${100 / 7}%`,
                      height: "100%",
                      display: "grid",
                      gridTemplateRows: `repeat(${hourSlots.length}, 50px)`,
                      gap: 0,
                    }}
                  >
                    {hourSlots.map((hour, hourIdx) => (
                      <div
                        key={hourIdx}
                        className="wv-slot"
                        onClick={(e) => {
                          e.stopPropagation();
                          const clickedDate = new Date(day);
                          const timeString = `${hour.toString().padStart(2, "0")}:00`;
                          onDateClick(clickedDate, timeString);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            const clickedDate = new Date(day);
                            const timeString = `${hour.toString().padStart(2, "0")}:00`;
                            onDateClick(clickedDate, timeString);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select time slot ${hour}:00 on ${day.toLocaleDateString()}`}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Events */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                left: "50px",
                width: "calc(100% - 50px)",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              {weekDays.map((day, dayIdx) => {
                const dayEvents = weekEvents[dayIdx];
                const allDayEvents = [
                  ...dayEvents.liveClasses.map((lc) => ({
                    ...lc,
                    type: "class" as const,
                    start: new Date(lc.scheduledAt),
                    end: new Date(
                      new Date(lc.scheduledAt).getTime() +
                        (lc.duration || 60) * 60 * 1000,
                    ),
                  })),
                  ...dayEvents.assignments.map((a) => ({
                    ...a,
                    type: "assignment" as const,
                    start: new Date(a.dueDate!),
                    end: new Date(
                      new Date(a.dueDate!).getTime() + 60 * 60 * 1000,
                    ),
                  })),
                ].sort((a, b) => a.start.getTime() - b.start.getTime());

                return (
                  <div
                    key={dayIdx}
                    style={{
                      position: "absolute",
                      left: `${(dayIdx / 7) * 100}%`,
                      width: `${100 / 7}%`,
                      height: "100%",
                      pointerEvents: "none",
                      padding: "3px",
                    }}
                  >
                    {allDayEvents.map((event, eventIdx) => {
                      const position = getEventPosition(event.start, dayIdx);
                      const height = getEventHeight(event.start, event.end);
                      const isClass = event.type === "class";
                      const eventColor = isClass
                        ? {
                            bg: "rgba(16,185,129,0.12)",
                            border: theme.colors.primary,
                            text: theme.colors.successText,
                          }
                        : {
                            bg: "rgba(245,158,11,0.12)",
                            border: theme.colors.warning,
                            text: theme.colors.warningText,
                          };

                      return (
                        <div
                          key={eventIdx}
                          className="wv-event"
                          style={{
                            position: "absolute",
                            top: `${position.top}px`,
                            left: "2px",
                            right: "2px",
                            height: `${Math.max(height, 30)}px`,
                            backgroundColor: eventColor.bg,
                            borderLeft: `2px solid ${eventColor.border}`,
                            borderRadius: "0 5px 5px 0",
                            padding: "4px 6px",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            zIndex: 10,
                            pointerEvents: "auto",
                            overflow: "hidden",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEventClick)
                              onEventClick(
                                event,
                                isClass ? "class" : "assignment",
                              );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              if (onEventClick)
                                onEventClick(
                                  event,
                                  isClass ? "class" : "assignment",
                                );
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details for ${event.title}`}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              height: "100%",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontSize: "10px",
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
                              </p>
                              <p
                                style={{
                                  fontSize: "9px",
                                  color: eventColor.text,
                                  margin: "2px 0 0",
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  opacity: 0.85,
                                }}
                              >
                                {isClass && "meetingLink" in event && (
                                  <>
                                    <Video size={8} />
                                    <span>Virtual</span>
                                  </>
                                )}
                                {!isClass && (
                                  <>
                                    <FileText size={8} />
                                    <span>Assignment</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <p
                              style={{
                                fontSize: "9px",
                                fontWeight: 600,
                                color: eventColor.text,
                                margin: 0,
                                opacity: 0.85,
                              }}
                            >
                              {formatTime(event.start)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
