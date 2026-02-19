// Sidebar nav: full labels (desktop) → icon strip (tablet) → horizontal tabs (mobile).
import React from "react";
import { theme } from "@/styles/theme";
import { User, Shield, Bell, Palette } from "lucide-react";
import type { SettingsSection } from "@/shared/types/settings.types";

interface SidebarProps {
  active: SettingsSection;
  onChange: (s: SettingsSection) => void;
}

const ITEMS: {
  id: SettingsSection;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "profile",
    label: "Profile",
    desc: "Name, photo, bio",
    icon: <User size={18} />,
  },
  {
    id: "account",
    label: "Account",
    desc: "Security & locale",
    icon: <Shield size={18} />,
  },
  {
    id: "notifications",
    label: "Notifications",
    desc: "Alert preferences",
    icon: <Bell size={18} />,
  },
  {
    id: "appearance",
    label: "Appearance",
    desc: "Theme & editor",
    icon: <Palette size={18} />,
  },
];

export default function SettingsSidebar({ active, onChange }: SidebarProps) {
  const css = `
    /* ── Mobile: horizontal scrollable tab strip ─────────── */
    .ss-desktop { display: none !important; }
    .ss-mobile  {
      display: flex;
      overflow-x: auto;
      gap: 4px;
      padding: 0 0 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      border-bottom: 1px solid ${theme.colors.border};
      margin-bottom: 20px;
    }
    .ss-mobile::-webkit-scrollbar { display: none; }
    .ss-mobile-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: ${theme.borderRadius.md};
      border: 1.5px solid transparent;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      font-family: ${theme.font.sans};
      transition: all ${theme.transitions.fast};
    }

    /* ── Tablet 640px+: icon-only strip ─────────────────── */
    @media (min-width: 640px) {
      .ss-mobile  { display: none !important; }
      .ss-desktop { display: flex !important; flex-direction: column; gap: 2px; width: 60px; flex-shrink: 0; }
      .ss-label   { display: none !important; }
      .ss-desc    { display: none !important; }
      .ss-item    { justify-content: center !important; padding: 10px !important; }
    }

    /* ── Desktop 1024px+: full sidebar ──────────────────── */
    @media (min-width: 1024px) {
      .ss-desktop { width: 220px !important; }
      .ss-label   { display: block !important; }
      .ss-desc    { display: block !important; }
      .ss-item    { justify-content: flex-start !important; padding: 10px 12px !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* ── Mobile horizontal tabs ──────────────────────────── */}
      <div className="ss-mobile">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className="ss-mobile-btn"
              onClick={() => onChange(item.id)}
              style={{
                backgroundColor: isActive
                  ? theme.colors.primaryFaint
                  : "transparent",
                borderColor: isActive ? theme.colors.primary : "transparent",
                color: isActive
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ── Desktop / Tablet sidebar ─────────────────────────── */}
      <div className="ss-desktop">
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className="ss-item"
              onClick={() => onChange(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                border: "none",
                borderRadius: theme.borderRadius.md,
                backgroundColor: isActive
                  ? theme.colors.bgActive
                  : "transparent",
                color: isActive
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: theme.font.sans,
                transition: `all ${theme.transitions.fast}`,
                borderLeft: isActive
                  ? `3px solid ${theme.colors.primary}`
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = theme.colors.bgHover;
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Icon */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive
                    ? theme.colors.primaryFaint
                    : theme.colors.bgHover,
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.textMuted,
                  border: `1px solid ${isActive ? theme.colors.primaryGlow : theme.colors.border}`,
                }}
              >
                {item.icon}
              </div>
              {/* Labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="ss-label"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "inherit",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="ss-desc"
                  style={{
                    fontSize: "11px",
                    color: theme.colors.textMuted,
                    margin: "1px 0 0",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
