// One row: icon + label/description + right-side control slot.
import React from "react";
import { theme } from "@/styles/theme";

interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  control: React.ReactNode;
  last?: boolean; // omit bottom border on last row
}

export default function SettingsRow({
  icon,
  label,
  description,
  control,
  last = false,
}: SettingsRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "13px 0",
        borderBottom: last ? "none" : `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Left: optional icon + text */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flex: 1,
          minWidth: 0,
        }}
      >
        {icon && (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              flexShrink: 0,
              backgroundColor: theme.colors.bgHover,
              border: `1px solid ${theme.colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.textSecondary,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: theme.colors.textMain,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </p>
          {description && (
            <p
              style={{
                fontSize: "12px",
                color: theme.colors.textMuted,
                margin: "2px 0 0",
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {/* Right: control */}
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}
