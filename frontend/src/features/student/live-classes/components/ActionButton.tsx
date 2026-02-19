import React from "react";
import { theme } from "@/styles/theme";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ActionButton({
  label,
  onClick,
  disabled = false,
  variant = "primary",
  icon,
  style,
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        padding: "10px 20px",
        background: disabled
          ? theme.colors.bgHover
          : isPrimary
            ? theme.gradients.primary
            : "transparent",
        color: disabled
          ? theme.colors.textMuted
          : isPrimary
            ? "#fff"
            : theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        fontWeight: 700,
        fontSize: "13.5px",
        border: isPrimary
          ? "none"
          : `1px solid ${disabled ? theme.colors.border : theme.colors.primary}`,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: `all ${theme.transitions.fast}`,
        opacity: disabled ? 0.6 : 1,
        whiteSpace: "nowrap",
        boxShadow: !disabled && isPrimary ? theme.shadows.glowSm : "none",
        fontFamily: theme.font.sans,
        letterSpacing: "0.01em",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (isPrimary) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 6px 20px rgba(16,185,129,0.4)`;
        } else {
          e.currentTarget.style.background = theme.colors.primaryFaint;
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isPrimary
          ? theme.shadows.glowSm
          : "none";
        if (!isPrimary) e.currentTarget.style.background = "transparent";
      }}
    >
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {label}
    </button>
  );
}
