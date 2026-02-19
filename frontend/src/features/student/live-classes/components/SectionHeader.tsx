import React from "react";
import { theme } from "@/styles/theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  count?: number;
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  iconBg,
  count,
  action,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon && (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: iconBg ?? theme.gradients.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: theme.colors.textMain,
                margin: 0,
              }}
            >
              {title}
            </h2>
            {count !== undefined && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: theme.borderRadius.full,
                  background: theme.colors.bgHover,
                  color: theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {count}
              </span>
            )}
          </div>
          {subtitle && (
            <p
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                margin: 0,
                marginTop: "1px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}
