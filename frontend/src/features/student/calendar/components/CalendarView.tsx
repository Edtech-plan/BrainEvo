import React, { useState, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { theme } from "@/styles/theme";
import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import AddEventModal from "./AddEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { useLiveClasses } from "@/features/student/live-classes";
import { useAssignments } from "@/features/student/assignment/hooks/useAssignments";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LiveClass } from "@/shared/types";
import type { Assignment } from "@/shared/types";

export type ViewMode = "month" | "week" | "day";

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  );
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    | ((LiveClass & { type: "class" }) | (Assignment & { type: "assignment" }))
    | null
  >(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);

  const { liveClasses, loading: classesLoading, refetch } = useLiveClasses();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { isAuthenticated } = useAuth();

  const canCreateEvents = isAuthenticated;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsViewDropdownOpen(false);
      }
    };
    if (isViewDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isViewDropdownOpen]);

  const loading = classesLoading || assignmentsLoading;

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    setIsViewDropdownOpen(false);
  };

  const getViewLabel = () =>
    viewMode.charAt(0).toUpperCase() + viewMode.slice(1);

  const handleDateClick = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsAddEventModalOpen(true);
  };

  const handleEventCreated = () => {
    refetch();
  };

  const handleEventClick = (
    event: LiveClass | Assignment,
    type: "class" | "assignment",
  ) => {
    if (type === "class") {
      setSelectedEvent({ ...event, type: "class" } as LiveClass & {
        type: "class";
      });
    } else {
      setSelectedEvent({ ...event, type: "assignment" } as Assignment & {
        type: "assignment";
      });
    }
    setIsEventDetailsModalOpen(true);
  };

  const navigateDate = (direction: "prev" | "next" | "today") => {
    const newDate = new Date(currentDate);
    switch (direction) {
      case "prev":
        if (viewMode === "month") newDate.setMonth(newDate.getMonth() - 1);
        else if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
        else newDate.setDate(newDate.getDate() - 1);
        break;
      case "next":
        if (viewMode === "month") newDate.setMonth(newDate.getMonth() + 1);
        else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
        else newDate.setDate(newDate.getDate() + 1);
        break;
      case "today":
        newDate.setTime(Date.now());
        break;
    }
    setCurrentDate(newDate);
  };

  const getDateDisplay = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const css = `
    @keyframes cvSpin { to { transform: rotate(360deg); } }
    @keyframes cvFadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    .cv-nav-btn { transition: all ${theme.transitions.fast} !important; }
    .cv-nav-btn:hover { background: ${theme.colors.bgHover} !important; color: ${theme.colors.textMain} !important; border-color: ${theme.colors.borderLight} !important; }
    .cv-tab { transition: all ${theme.transitions.fast} !important; }
    .cv-tab:hover { color: ${theme.colors.textMain} !important; }
    .cv-add-btn { transition: all ${theme.transitions.fast} !important; }
    .cv-add-btn:hover { background: ${theme.colors.primaryDark} !important; transform: translateY(-1px) !important; box-shadow: 0 6px 20px rgba(16,185,129,0.35) !important; }
    .cv-today-btn { transition: all ${theme.transitions.fast} !important; }
    .cv-today-btn:hover { background: rgba(16,185,129,0.12) !important; border-color: rgba(16,185,129,0.3) !important; color: ${theme.colors.primary} !important; }
    .cv-dropdown-item { transition: background ${theme.transitions.fast} !important; }
    .cv-dropdown-item:hover { background: ${theme.colors.bgHover} !important; }
    @media (max-width: 640px) {
      .cv-header-row { flex-direction: column !important; align-items: stretch !important; }
      .cv-header-actions { justify-content: space-between !important; }
      .cv-nav-row { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
      .cv-date-label { font-size: 13px !important; }
    }
  `;

  const VIEW_TABS: Array<{ id: ViewMode; label: string }> = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
  ];

  return (
    <div style={{ paddingBottom: "40px" }}>
      <style>{css}</style>

      {/* ── Unified Header Container ───────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: "16px 20px",
          marginBottom: "20px",
          boxShadow: theme.shadows.card,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle ambient glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-30px",
            left: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Top Row: Title + Actions */}
        <div
          className="cv-header-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "14px",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h1
              style={{
                fontSize: "clamp(18px,3vw,24px)",
                fontWeight: 800,
                color: theme.colors.textMain,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Calendar
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: theme.colors.textSecondary,
                margin: "4px 0 0",
              }}
            >
              Manage your schedule and upcoming classes.
            </p>
          </div>

          <div
            className="cv-header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {/* View Toggle Tabs */}
            <div
              style={{
                display: "flex",
                background: `rgba(13,17,23,0.5)`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                padding: "3px",
                gap: "2px",
              }}
            >
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className="cv-tab"
                  onClick={() => handleViewChange(tab.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: theme.font.sans,
                    background:
                      viewMode === tab.id
                        ? theme.gradients.primary
                        : "transparent",
                    color:
                      viewMode === tab.id ? "#fff" : theme.colors.textSecondary,
                    boxShadow:
                      viewMode === tab.id ? theme.shadows.glowSm : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Event Button */}
            {canCreateEvents && (
              <button
                className="cv-add-btn"
                onClick={() => setIsAddEventModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 16px",
                  borderRadius: theme.borderRadius.md,
                  border: "none",
                  background: theme.gradients.primary,
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: theme.shadows.glowSm,
                  fontFamily: theme.font.sans,
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={15} />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: "14px",
          }}
        >
          {/* Bottom Row: Date Nav */}
          <div
            className="cv-nav-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Prev/Next Buttons */}
              <div style={{ display: "flex", gap: "3px" }}>
                <button
                  className="cv-nav-btn"
                  onClick={() => navigateDate("prev")}
                  aria-label="Previous"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.textSecondary,
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="cv-nav-btn"
                  onClick={() => navigateDate("next")}
                  aria-label="Next"
                  style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.sm,
                    color: theme.colors.textSecondary,
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Date Label */}
              <h2
                className="cv-date-label"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: theme.colors.textMain,
                  margin: 0,
                }}
              >
                {getDateDisplay()}
              </h2>
            </div>

            {/* Today Button */}
            <button
              className="cv-today-btn"
              onClick={() => navigateDate("today")}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: theme.colors.textSecondary,
                background: "transparent",
                padding: "6px 12px",
                borderRadius: theme.borderRadius.sm,
                border: `1px solid ${theme.colors.border}`,
                cursor: "pointer",
                fontFamily: theme.font.sans,
              }}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* ── Calendar Views ─────────────────────────────────────────────── */}
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 20px",
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.card,
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border: `2px solid ${theme.colors.border}`,
              borderTopColor: theme.colors.primary,
              animation: "cvSpin 0.75s linear infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "13px",
              color: theme.colors.textSecondary,
              fontWeight: 500,
            }}
          >
            Loading calendar...
          </span>
        </div>
      ) : (
        <>
          {viewMode === "month" && (
            <MonthView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === "week" && (
            <WeekView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === "day" && (
            <DayView
              currentDate={currentDate}
              liveClasses={liveClasses}
              assignments={assignments}
              onDateClick={canCreateEvents ? handleDateClick : undefined}
              onEventClick={handleEventClick}
            />
          )}
        </>
      )}

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setSelectedDate(undefined);
          setSelectedTime(undefined);
        }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onEventCreated={handleEventCreated}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventDetailsModalOpen}
        onClose={() => {
          setIsEventDetailsModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
}
