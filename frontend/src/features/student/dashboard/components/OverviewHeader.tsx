import React from "react";
import { theme } from "@/styles/theme";
// FIX: useProfileAvatar — subscribes to service, reflects avatar/name changes instantly
import { useProfileAvatar } from "@/features/student/settings";
import { Sparkles } from "lucide-react";

export default function OverviewHeader() {
  const { fullName, loading } = useProfileAvatar();

  const firstName =
    !loading && fullName ? fullName.split(" ")[0] : loading ? "" : "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 800,
              color: theme.colors.textMain,
              margin: 0,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "1em",
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.bgHover,
                  verticalAlign: "middle",
                  opacity: 0.6,
                }}
              />
            ) : (
              `${greeting}${firstName ? `, ${firstName}` : ""}!`
            )}
          </h1>
        </div>
        <p
          style={{
            color: theme.colors.textSecondary,
            margin: 0,
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          {today}&nbsp;·&nbsp;Here's your learning overview
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          background: theme.colors.primaryFaint,
          border: `1px solid rgba(16,185,129,0.2)`,
          borderRadius: theme.borderRadius.full,
        }}
      >
        <Sparkles size={12} color={theme.colors.primary} />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: theme.colors.primary,
          }}
        >
          Student
        </span>
      </div>
    </div>
  );
}
