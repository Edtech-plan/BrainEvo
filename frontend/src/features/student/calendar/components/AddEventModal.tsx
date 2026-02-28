// src/features/student/calendar/components/AddEventModal.tsx
// Modal for creating a new live class/event.
//
// BUG FIXED: Date showing one day behind (e.g. clicking 19th showed 18th).
// ROOT CAUSE: `Date.toISOString()` converts to UTC before formatting.
//   In IST (UTC+5:30), midnight local = 18:30 of the PREVIOUS day in UTC.
//   So `new Date(2026,1,19).toISOString()` → "2026-02-18T18:30:00.000Z"
//   and `.split('T')[0]` → "2026-02-18" — wrong by 1 day.
// FIX: Use `toLocalISODate()` which reads local year/month/day directly.

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Calendar,
  Clock,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { theme } from "@/styles/theme";
import liveClassService from "@/features/student/live-classes/services/liveClass.service";
import userService from "@/modules/user/user.service";
import type { User } from "@/shared/types";
import { useLiveClasses } from "@/features/student/live-classes";

// ─────────────────────────────────────────────────────────────────────────────
// Utility: formats a Date as "YYYY-MM-DD" using LOCAL timezone.
// Never use .toISOString() for date inputs — it converts to UTC first,
// which shifts the date backwards in timezones ahead of UTC (e.g. IST).
// ─────────────────────────────────────────────────────────────────────────────
function toLocalISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared input field wrapper — positions a leading icon inside the input
// ─────────────────────────────────────────────────────────────────────────────
const InputWrapper = React.memo(
  ({
    children,
    icon,
  }: {
    children: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: theme.colors.textSecondary,
          display: "flex",
          alignItems: "center",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {icon}
      </div>
      {children}
    </div>
  ),
);
InputWrapper.displayName = "InputWrapper";

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles applied to all <input> / <select> elements in the form
// ─────────────────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px 11px 40px",
  borderRadius: theme.borderRadius.md,
  border: `1.5px solid ${theme.colors.border}`,
  fontSize: "14px",
  color: theme.colors.textMain,
  backgroundColor: theme.colors.bgInput,
  outline: "none",
  transition: `all ${theme.transitions.fast}`,
  fontFamily: theme.font.sans,
  boxSizing: "border-box",
};

// Shared label style
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: theme.colors.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "7px",
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The date the user clicked on the calendar — passed as a local Date object */
  selectedDate?: Date;
  /** Pre-filled hour string, e.g. "09:00" */
  selectedTime?: string;
  onEventCreated?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function AddEventModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onEventCreated,
}: AddEventModalProps) {
  const [eventName, setEventName] = useState("");
  const [link, setLink] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // ── Date & time state initialised with local-safe formatter ─────────────
  // Uses toLocalISODate() instead of toISOString() to avoid UTC offset shift.
  const [date, setDate] = useState<string>(
    selectedDate ? toLocalISODate(selectedDate) : toLocalISODate(new Date()),
  );
  const [time, setTime] = useState<string>(selectedTime ?? "09:00");

  const { refetch } = useLiveClasses();

  // Track whether modal was previously open to avoid re-running on every render
  const prevIsOpenRef = useRef(false);
  const initializedRef = useRef(false);

  const handleEventNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value),
    [],
  );

  // ── Re-initialise form whenever modal opens ─────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      // Reset tracking refs when modal closes
      prevIsOpenRef.current = false;
      initializedRef.current = false;
      return;
    }

    const wasJustOpened = !prevIsOpenRef.current;
    if (wasJustOpened) {
      // Reset all fields
      setEventName("");
      setLink("");
      setSelectedStudentId("");
      setError(null);

      // ── FIXED: use toLocalISODate to avoid UTC date shift ──────────────
      // Previously: selectedDate.toISOString().split('T')[0]
      //   → converted to UTC first, giving yesterday's date in IST (+5:30)
      // Now: reads local year/month/day directly — always correct.
      setDate(
        selectedDate
          ? toLocalISODate(selectedDate)
          : toLocalISODate(new Date()),
      );
      setTime(selectedTime ?? "09:00");

      fetchStudents();
      prevIsOpenRef.current = true;
      initializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handles Escape key globally while modal is open.
  // This is the correct a11y pattern — escape closes a dialog regardless of where focus is.
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // ── Fetch learner list for the student dropdown ─────────────────────────
  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);
      setError(null);
      const response = await userService.getUsers();
      if (response.success && response.data) {
        const learners = (response.data as User[]).filter(
          (u) => u.role === "learner",
        );
        setStudents(learners);
      }
    } catch (err) {
      console.error("AddEventModal: failed to fetch students", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  // ── Form submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Build ISO timestamp from the LOCAL date+time strings the user picked.
      // `new Date(`${date}T${time}`)` interprets the string in LOCAL time
      // when the string has no timezone suffix — this is correct behaviour.
      const dateTime = new Date(`${date}T${time}`);
      const scheduledAt = dateTime.toISOString(); // safe here — sending to API in UTC is correct

      const eventData = {
        title: eventName,
        scheduledAt,
        meetingLink: link || "https://meet.google.com",
        duration: 60,
        description: eventName,
      };

      const response = await liveClassService.createLiveClass(eventData);

      if (response.success) {
        await refetch();
        onEventCreated?.();
        onClose();
      } else {
        setError("Failed to create event. Please try again.");
      }
    } catch (err: unknown) {
      console.error("AddEventModal: error creating event", err);

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 403) {
          setError("You do not have permission to create events.");
        } else if (axiosError.response?.status === 401) {
          setError("Please log in to create events.");
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to create event. Please try again.");
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create event. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ── Focus/blur handlers for input border highlight ──────────────────────
  const onFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = theme.colors.primary;
    e.currentTarget.style.boxShadow = theme.shadows.input;
  };
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = theme.colors.border;
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: theme.colors.bgOverlay,
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: theme.zIndex.modal,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
      tabIndex={-1}
    >
      <style>{`
        @keyframes aemSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes aemSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Modal panel ─────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-event-modal-title"
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          width: "100%",
          maxWidth: "520px",
          boxShadow: theme.shadows.modal,
          border: `1px solid ${theme.colors.borderLight}`,
          overflow: "hidden",
          animation: "aemSlideUp 0.25s ease-out",
        }}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(13,17,23,0.3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Icon badge */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: theme.gradients.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: theme.shadows.glowSm,
              }}
            >
              <Calendar size={15} color="#fff" />
            </div>
            <div>
              <h2
                id="add-event-modal-title"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: theme.colors.textMain,
                  margin: 0,
                }}
              >
                Add New Event
              </h2>
              {/* Show the correctly-formatted local date in the subtitle */}
              <p
                style={{
                  fontSize: "11px",
                  color: theme.colors.textMuted,
                  margin: 0,
                }}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })
                  : "Schedule a new live class"}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "7px",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              transition: `all ${theme.transitions.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.bgHover;
              e.currentTarget.style.color = theme.colors.textMain;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = theme.colors.textSecondary;
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          {/* Event name */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="aem-event-name" style={labelStyle}>
              Event Name <span style={{ color: theme.colors.error }}>*</span>
            </label>
            <InputWrapper icon={<Calendar size={16} />}>
              <input
                id="aem-event-name"
                type="text"
                value={eventName}
                onChange={handleEventNameChange}
                required
                autoComplete="off"
                placeholder="Enter event name"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </InputWrapper>
          </div>

          {/* Date + Time row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {/* Date — value is always a correct local YYYY-MM-DD string */}
            <div>
              <label htmlFor="aem-date" style={labelStyle}>
                Date <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <InputWrapper icon={<Calendar size={16} />}>
                <input
                  id="aem-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </InputWrapper>
            </div>

            {/* Time */}
            <div>
              <label htmlFor="aem-time" style={labelStyle}>
                Time <span style={{ color: theme.colors.error }}>*</span>
              </label>
              <InputWrapper icon={<Clock size={16} />}>
                <input
                  id="aem-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </InputWrapper>
            </div>
          </div>

          {/* Meeting link */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="aem-link" style={labelStyle}>
              Meeting Link{" "}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  color: theme.colors.textMuted,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (Optional)
              </span>
            </label>
            <InputWrapper icon={<LinkIcon size={16} />}>
              <input
                id="aem-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </InputWrapper>
          </div>

          {/* Student selector */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="aem-student" style={labelStyle}>
              Student{" "}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 400,
                  color: theme.colors.textMuted,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (Optional)
              </span>
            </label>
            <InputWrapper icon={<UserIcon size={16} />}>
              <select
                id="aem-student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={studentsLoading}
                aria-label="Select student"
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: "36px",
                  color: selectedStudentId
                    ? theme.colors.textMain
                    : theme.colors.textMuted,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="" disabled>
                  {studentsLoading ? "Loading students..." : "Select a student"}
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                    {student.email ? ` (${student.email})` : ""}
                  </option>
                ))}
              </select>
            </InputWrapper>
            {students.length === 0 && !studentsLoading && (
              <p
                style={{
                  fontSize: "11px",
                  color: theme.colors.textMuted,
                  margin: "5px 0 0",
                }}
              >
                No students available
              </p>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                marginBottom: "16px",
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.errorBg,
                border: `1px solid ${theme.colors.errorBorder}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle
                size={15}
                color={theme.colors.error}
                style={{ flexShrink: 0 }}
              />
              <span
                style={{
                  color: theme.colors.errorText,
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {error}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              paddingTop: "14px",
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                background: "transparent",
                color: theme.colors.textSecondary,
                fontSize: "13px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: `all ${theme.transitions.fast}`,
                opacity: loading ? 0.5 : 1,
                fontFamily: theme.font.sans,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = theme.colors.bgHover;
                  e.currentTarget.style.color = theme.colors.textMain;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: theme.borderRadius.md,
                border: "none",
                background: loading
                  ? theme.colors.bgHover
                  : theme.gradients.primary,
                color: loading ? theme.colors.textMuted : "#fff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: `all ${theme.transitions.fast}`,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: loading ? "none" : theme.shadows.glowSm,
                fontFamily: theme.font.sans,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(16,185,129,0.35)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = theme.shadows.glowSm;
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    style={{ animation: "aemSpin 1s linear infinite" }}
                  />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
