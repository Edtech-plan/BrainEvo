// Fully accessible ARIA switch toggle.
import React from "react";
import { theme } from "@/styles/theme";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        backgroundColor: checked ? theme.colors.primary : theme.colors.bgHover,
        border: `1.5px solid ${checked ? theme.colors.primary : theme.colors.border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: `all ${theme.transitions.fast}`,
        opacity: disabled ? 0.45 : 1,
        padding: 0,
        outline: "none",
        flexShrink: 0,
        boxShadow: checked ? theme.shadows.glowSm : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "21px" : "3px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: `left ${theme.transitions.fast}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}
      />
    </button>
  );
}
