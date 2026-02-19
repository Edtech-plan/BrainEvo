import React from "react";
import { theme } from "@/styles/theme";
import ActionButton from "./ActionButton";
import SectionHeader from "./SectionHeader";
import { Clock, User, Signal, Radio } from "lucide-react";
import { useLiveClasses } from "../hooks/useLiveClasses";

export default function OngoingClass() {
  const { ongoingClasses, loading } = useLiveClasses();

  if (loading) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            height: "34px",
            width: "220px",
            background: theme.colors.bgHover,
            borderRadius: "9px",
            marginBottom: "16px",
          }}
        />
        <div
          style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.lg,
            padding: "20px",
            minHeight: "160px",
          }}
        />
      </div>
    );
  }

  if (ongoingClasses.length === 0) {
    return (
      <div style={{ marginBottom: "28px" }}>
        <SectionHeader
          title="Ongoing Session"
          subtitle="No active sessions right now"
          icon={<Signal size={17} color="#fff" />}
          iconBg="linear-gradient(135deg, #64748b, #475569)"
        />
        <div
          style={{
            background: theme.colors.bgCard,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.lg,
            padding: "32px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "11px",
              background: theme.colors.bgHover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Radio size={22} color={theme.colors.textMuted} />
          </div>
          <p
            style={{
              color: theme.colors.textMuted,
              fontSize: "13px",
              margin: 0,
            }}
          >
            No ongoing classes at the moment
          </p>
        </div>
      </div>
    );
  }

  const liveClass = ongoingClasses[0];
  const scheduledAt = new Date(liveClass.scheduledAt);

  return (
    <div style={{ marginBottom: "28px" }}>
      <style>{`
        @keyframes livePulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.5); } }
        .lc-ongoing-card { display:flex; flex-direction:column; gap:0; }
        @media (min-width:768px) { .lc-ongoing-card { flex-direction:row; } }
      `}</style>

      <SectionHeader
        title="Ongoing Session"
        subtitle="A class is currently live"
        icon={<Signal size={17} color="#fff" />}
        iconBg="linear-gradient(135deg, #ef4444, #dc2626)"
      />

      <div
        className="lc-ongoing-card"
        style={{
          background: theme.colors.bgCard,
          border: `1px solid rgba(248,81,73,0.25)`,
          borderRadius: theme.borderRadius.lg,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(248,81,73,0.1)",
          position: "relative",
        }}
      >
        {/* Bottom red stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #ef4444, transparent)",
            opacity: 0.6,
          }}
        />

        {/* Thumbnail panel */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1a0a0a 0%, #2d1212 50%, #1a0a0a 100%)",
            minHeight: "160px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
          className="lc-thumb"
        >
          <style>{`.lc-thumb { width:100%; } @media(min-width:768px){.lc-thumb{width:220px;min-height:auto;}}`}</style>
          {/* Radial glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "rgba(239,68,68,0.2)",
                border: "1.5px solid rgba(239,68,68,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                backdropFilter: "blur(4px)",
              }}
            >
              <Signal size={24} color="#ef4444" />
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              LIVE FEED
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Title row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "clamp(16px, 2vw, 20px)",
                  fontWeight: 800,
                  color: theme.colors.textMain,
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {liveClass.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: theme.colors.textSecondary,
                }}
              >
                {liveClass.courseId ?? "Live Class"}
              </p>
            </div>
            {/* Live badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: theme.borderRadius.full,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "livePulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fca5a5",
                  letterSpacing: "0.06em",
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* Meta chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {liveClass.instructor && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  background: theme.colors.bgHover,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.full,
                }}
              >
                <User size={12} color={theme.colors.textMuted} />
                <span
                  style={{
                    fontSize: "12px",
                    color: theme.colors.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  {liveClass.instructor.name}
                </span>
              </div>
            )}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 10px",
                background: theme.colors.bgHover,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.full,
              }}
            >
              <Clock size={12} color={theme.colors.textMuted} />
              <span
                style={{
                  fontSize: "12px",
                  color: theme.colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                Started{" "}
                {scheduledAt.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ActionButton
              label="Join Class Now"
              icon={<Signal size={14} />}
              onClick={() => window.open(liveClass.meetingLink, "_blank")}
              style={{ padding: "10px 22px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
