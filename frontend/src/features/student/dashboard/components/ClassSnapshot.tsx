// src/features/student/dashboard/components/ClassSnapshot.tsx
import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import { useLiveClasses } from "@/features/student/live-classes";
import { GraduationCap, ArrowRight, Clock, User } from "lucide-react";

export default function ClassSnapshot() {
  const { upcomingClasses, loading } = useLiveClasses();
  const nextClass = useMemo(
    () => upcomingClasses?.[0] ?? null,
    [upcomingClasses],
  );

  if (loading) {
    return (
      <div
        style={{
          background: theme.colors.bgCard,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: "20px",
          height: "100%",
        }}
      >
        {[60, 80, 50].map((w, i) => (
          <div
            key={i}
            style={{
              height: "13px",
              width: `${w}%`,
              background: theme.colors.bgHover,
              borderRadius: "4px",
              marginBottom: "14px",
            }}
          />
        ))}
      </div>
    );
  }

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
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: theme.gradients.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: theme.shadows.glowSm,
            flexShrink: 0,
          }}
        >
          <GraduationCap size={17} color="#fff" />
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
            Current Batch
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: theme.colors.textMuted,
              margin: 0,
            }}
          >
            Next scheduled class
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {nextClass ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              {
                icon: GraduationCap,
                label: "Course",
                value: nextClass.title,
                color: theme.colors.textMain,
              },
              ...(nextClass.instructor
                ? [
                    {
                      icon: User,
                      label: "Instructor",
                      value: nextClass.instructor.name,
                      color: theme.colors.textMain,
                    },
                  ]
                : []),
              {
                icon: Clock,
                label: "Next Class",
                value: new Date(nextClass.scheduledAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  },
                ),
                color: theme.colors.primary,
              },
            ].map((row, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    i < arr.length - 1
                      ? `1px solid ${theme.colors.border}`
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: row.color,
                    fontWeight: 600,
                    maxWidth: "58%",
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
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
              <GraduationCap size={20} color={theme.colors.textMuted} />
            </div>
            <p
              style={{
                color: theme.colors.textMuted,
                fontSize: "13px",
                margin: 0,
                textAlign: "center",
              }}
            >
              No upcoming classes scheduled
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "9px 14px",
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border}`,
          background: "transparent",
          fontWeight: 600,
          fontSize: "13px",
          color: theme.colors.textSecondary,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          transition: `all ${theme.transitions.fast}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.colors.primary;
          e.currentTarget.style.color = theme.colors.primary;
          e.currentTarget.style.background = theme.colors.primaryFaint;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.color = theme.colors.textSecondary;
          e.currentTarget.style.background = "transparent";
        }}
      >
        View Course Details <ArrowRight size={13} />
      </button>
    </div>
  );
}
