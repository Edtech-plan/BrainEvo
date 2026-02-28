// src/features/student/dashboard/components/AttentionAlerts.tsx
import React, { useMemo } from "react";
import { theme } from "@/styles/theme";
import { useAssignments } from "@/features/student/assignment/hooks/useAssignments";
import { useLiveClasses } from "@/features/student/live-classes";
import { ShieldCheck, AlertTriangle, Clock, Zap } from "lucide-react";

export default function AttentionAlerts() {
  const { assignments, loading: al } = useAssignments();
  const { liveClasses, loading: ll } = useLiveClasses();
  const loading = al || ll;

  const alerts = useMemo(() => {
    const list: Array<{ msg: string; type: "error" | "warning" }> = [];
    const now = new Date();

    const missed = assignments.filter(
      (a) => a.dueDate && new Date(a.dueDate) < now,
    );
    if (missed.length)
      list.push({
        msg: `${missed.length} missed deadline${missed.length > 1 ? "s" : ""}`,
        type: "error",
      });

    liveClasses.forEach((lc) => {
      const d = new Date(lc.scheduledAt);
      const diff = d.getTime() - now.getTime();
      if (diff > 0 && diff <= 30 * 60 * 1000) {
        const mins = Math.round(diff / 60000);
        list.push({ msg: `"${lc.title}" in ${mins} min`, type: "warning" });
      }
    });

    return list;
  }, [assignments, liveClasses]);

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
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "12px",
              width: `${80 - i * 12}%`,
              background: theme.colors.bgHover,
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          />
        ))}
      </div>
    );
  }

  /* ── All Clear ── */
  if (alerts.length === 0) {
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
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "14px",
          }}
        >
          <ShieldCheck size={20} color={theme.colors.success} />
        </div>

        <h2
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: theme.colors.textMain,
            margin: "0 0 6px",
          }}
        >
          All Clear
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: theme.colors.textSecondary,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          You're on track — no missed deadlines or urgent alerts.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: theme.colors.border,
            margin: "16px 0",
          }}
        />

        {/* Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            "Review your schedule for next week",
            "Check pending resources",
          ].map((tip, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Zap size={11} color={theme.colors.primary} />
              <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Has alerts ── */
  return (
    <div
      style={{
        background: theme.colors.bgCard,
        border: `1px solid rgba(248,81,73,0.2)`,
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
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(248,81,73,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "rgba(248,81,73,0.12)",
            border: "1px solid rgba(248,81,73,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={17} color={theme.colors.error} />
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
            Needs Attention
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: theme.colors.textMuted,
              margin: 0,
            }}
          >
            {alerts.length} active alert{alerts.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {alerts.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: theme.borderRadius.md,
              background:
                a.type === "error"
                  ? "rgba(248,81,73,0.07)"
                  : "rgba(245,158,11,0.07)",
              border: `1px solid ${a.type === "error" ? "rgba(248,81,73,0.15)" : "rgba(245,158,11,0.15)"}`,
              alignItems: "flex-start",
            }}
          >
            {a.type === "error" ? (
              <AlertTriangle
                size={13}
                color={theme.colors.error}
                style={{ marginTop: "1px", flexShrink: 0 }}
              />
            ) : (
              <Clock
                size={13}
                color={theme.colors.warning}
                style={{ marginTop: "1px", flexShrink: 0 }}
              />
            )}
            <span
              style={{
                fontSize: "13px",
                color:
                  a.type === "error"
                    ? theme.colors.errorText
                    : theme.colors.warningText,
                lineHeight: 1.5,
              }}
            >
              {a.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
