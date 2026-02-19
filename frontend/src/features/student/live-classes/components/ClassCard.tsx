import React from "react";
import { theme } from "@/styles/theme";
import { User, Clock } from "lucide-react";

type ClassStatus = "Live Now" | "Upcoming" | "Completed" | "Scheduled";

interface ClassCardProps {
  title: string;
  teacher: string;
  time: string;
  status?: ClassStatus;
  children?: React.ReactNode;
}

const STATUS_STYLES: Record<
  ClassStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  "Live Now": {
    bg: "rgba(248,81,73,0.1)",
    text: theme.colors.errorText,
    border: "rgba(248,81,73,0.25)",
    dot: theme.colors.error,
  },
  Upcoming: {
    bg: "rgba(88,166,255,0.1)",
    text: theme.colors.infoText,
    border: "rgba(88,166,255,0.25)",
    dot: theme.colors.info,
  },
  Completed: {
    bg: "rgba(16,185,129,0.1)",
    text: theme.colors.successText,
    border: "rgba(16,185,129,0.25)",
    dot: theme.colors.success,
  },
  Scheduled: {
    bg: "rgba(245,158,11,0.1)",
    text: theme.colors.warningText,
    border: "rgba(245,158,11,0.25)",
    dot: theme.colors.warning,
  },
};

export default function ClassCard({
  title,
  teacher,
  time,
  status,
  children,
}: ClassCardProps) {
  const s = status ? STATUS_STYLES[status] : null;

  return (
    <div
      style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: "18px 20px",
        boxShadow: theme.shadows.card,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: `all ${theme.transitions.fast}`,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.borderLight;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadows.card;
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-24px",
          right: "-24px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${s ? s.dot + "18" : "rgba(16,185,129,0.08)"} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
          gap: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: theme.colors.textMain,
            margin: 0,
            lineHeight: 1.3,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h3>
        {s && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: theme.borderRadius.full,
              backgroundColor: s.bg,
              color: s.text,
              border: `1px solid ${s.border}`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {status === "Live Now" && (
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: s.dot,
                }}
              />
            )}
            {status}
          </span>
        )}
      </div>

      {/* Meta */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              background: theme.colors.bgHover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={11} color={theme.colors.textMuted} />
          </div>
          <span
            style={{
              fontSize: "13px",
              color: theme.colors.textSecondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {teacher}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              background: theme.colors.bgHover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock size={11} color={theme.colors.textMuted} />
          </div>
          <span style={{ fontSize: "13px", color: theme.colors.textSecondary }}>
            {time}
          </span>
        </div>
      </div>

      {/* Bottom color bar */}
      {s && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${s.dot}, transparent)`,
            opacity: 0.5,
          }}
        />
      )}

      {children && <div style={{ marginTop: "16px" }}>{children}</div>}
    </div>
  );
}
