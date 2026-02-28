// Titled card wrapper used in every settings section.
import React from "react";
import { theme } from "@/styles/theme";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function SettingsCard({
  title,
  description,
  children,
  action,
}: SettingsCardProps) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        overflow: "hidden",
        boxShadow: theme.shadows.sm,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: "rgba(13,17,23,0.4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: theme.colors.textMain,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              style={{
                fontSize: "13px",
                color: theme.colors.textSecondary,
                margin: "3px 0 0",
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {/* Body */}
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}
