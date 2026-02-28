import React from "react";
import { X, Calendar, Clock, Link as LinkIcon, Video } from "lucide-react";
import { theme } from "@/styles/theme";
import type { LiveClass } from "@/shared/types";
import type { Assignment } from "@/shared/types";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event:
    | (LiveClass & { type: "class" })
    | (Assignment & { type: "assignment" })
    | null;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

  const isClass = event.type === "class";
  const eventDate = isClass
    ? new Date(event.scheduledAt)
    : event.dueDate
      ? new Date(event.dueDate)
      : null;

  const eventEnd =
    isClass && eventDate
      ? new Date(eventDate.getTime() + (event.duration || 60) * 60 * 1000)
      : eventDate
        ? new Date(eventDate.getTime() + 60 * 60 * 1000)
        : null;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const accentColor = isClass ? theme.colors.primary : theme.colors.accent;
  const headerBg = isClass ? theme.colors.successBg : theme.colors.warningBg;
  const headerBorder = isClass
    ? theme.colors.successBorder
    : theme.colors.warningBorder;
  const iconBg = isClass ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)";
  const typeLabel = isClass ? "Live Class" : "Assignment";

  const InfoBlock = ({
    icon,
    label,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: theme.borderRadius.md,
          flexShrink: 0,
          background: iconBg,
          border: `1px solid ${headerBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: theme.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "3px",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: theme.colors.textMain,
            lineHeight: 1.4,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );

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
      <style>{`@keyframes edmSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-modal-title"
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          width: "100%",
          maxWidth: "480px",
          boxShadow: theme.shadows.modal,
          border: `1px solid ${theme.colors.borderLight}`,
          overflow: "hidden",
          animation: "edmSlideUp 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
        tabIndex={0}
      >
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}

        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: `1px solid ${headerBorder}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: headerBg,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "6px",
                  background: iconBg,
                  border: `1px solid ${headerBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isClass ? (
                  <Video size={13} color={accentColor} />
                ) : (
                  <Calendar size={13} color={accentColor} />
                )}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {typeLabel}
              </span>
            </div>
            <h2
              id="event-details-modal-title"
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: theme.colors.textMain,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: `1px solid ${headerBorder}`,
              borderRadius: "7px",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              flexShrink: 0,
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

        {/* Content */}
        <div style={{ padding: "20px" }}>
          {/* Date */}
          {eventDate && (
            <InfoBlock
              icon={<Calendar size={16} color={accentColor} />}
              label="Date"
            >
              {formatDate(eventDate)}
            </InfoBlock>
          )}

          {/* Time */}
          {eventDate && (
            <InfoBlock
              icon={<Clock size={16} color={accentColor} />}
              label="Time"
            >
              {formatTime(eventDate)}
              {eventEnd && ` – ${formatTime(eventEnd)}`}
              {isClass && event.duration && (
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.colors.textSecondary,
                    fontWeight: 400,
                    marginLeft: "8px",
                  }}
                >
                  ({event.duration} min)
                </span>
              )}
            </InfoBlock>
          )}

          {/* Description */}
          {"description" in event && event.description && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: theme.colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Description
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  background: theme.colors.bgHover,
                  borderRadius: theme.borderRadius.md,
                  padding: "10px 12px",
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {event.description}
              </div>
            </div>
          )}

          {/* Meeting Link */}
          {isClass && "meetingLink" in event && event.meetingLink && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: theme.colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Meeting Link
              </div>
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: theme.colors.primary,
                  textDecoration: "none",
                  padding: "8px 14px",
                  borderRadius: theme.borderRadius.md,
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  fontWeight: 600,
                  transition: `all ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(16,185,129,0.18)";
                  e.currentTarget.style.boxShadow = theme.shadows.glowSm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(16,185,129,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <LinkIcon size={14} />
                <span>Join Meeting</span>
              </a>
            </div>
          )}

          {/* Instructor */}
          {isClass && "instructor" in event && event.instructor && (
            <div style={{ marginBottom: "4px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: theme.colors.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Instructor
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: theme.gradients.primary,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    boxShadow: theme.shadows.glowSm,
                  }}
                >
                  {typeof event.instructor === "object" &&
                  "name" in event.instructor
                    ? event.instructor.name.charAt(0).toUpperCase()
                    : "I"}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: theme.colors.textMain,
                    }}
                  >
                    {typeof event.instructor === "object" &&
                    "name" in event.instructor
                      ? event.instructor.name
                      : "Instructor"}
                  </div>
                  {typeof event.instructor === "object" &&
                    "email" in event.instructor && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {event.instructor.email}
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${theme.colors.border}`,
            display: "flex",
            justifyContent: "flex-end",
            background: `rgba(13,17,23,0.3)`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 20px",
              borderRadius: theme.borderRadius.md,
              border: "none",
              background: theme.gradients.primary,
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              transition: `all ${theme.transitions.fast}`,
              fontFamily: theme.font.sans,
              boxShadow: theme.shadows.glowSm,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(16,185,129,0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = theme.shadows.glowSm;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
