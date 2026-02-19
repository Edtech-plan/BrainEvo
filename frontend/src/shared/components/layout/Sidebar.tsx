// src/shared/components/layout/Sidebar.tsx
import React, { ReactNode } from "react";
import { theme } from "../../../../styles/theme";

interface SidebarProps {
  navItems: Array<{ id: string; label: string; icon: ReactNode }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  isMobile?: boolean;
}

export default function Sidebar({
  navItems,
  activeSection,
  onSectionChange,
  collapsed,
  isMobile = false,
}: SidebarProps) {
  return (
    <aside
      style={{
        width: isMobile
          ? "100%"
          : collapsed
            ? theme.sizes.sidebarCollapsedWidth
            : theme.sizes.sidebarWidth,
        height: "100%",
        background: theme.colors.bgSurface,
        borderRight: isMobile ? "none" : `1px solid ${theme.colors.border}`,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        padding: "10px 8px",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={collapsed && !isMobile ? item.label : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: collapsed && !isMobile ? "11px 0" : "10px 12px",
                justifyContent:
                  collapsed && !isMobile ? "center" : "flex-start",
                borderRadius: theme.borderRadius.md,
                cursor: "pointer",
                // Active: gradient sweep from left
                background: isActive
                  ? "linear-gradient(90deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.04) 100%)"
                  : "transparent",
                borderLeft: isActive
                  ? `2px solid ${theme.colors.primary}`
                  : "2px solid transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                color: isActive
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
                fontSize: "13.5px",
                fontWeight: isActive ? 600 : 400,
                transition: `all ${theme.transitions.fast}`,
                whiteSpace: "nowrap",
                textAlign: "left",
                letterSpacing: isActive ? "-0.01em" : "normal",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = theme.colors.bgHover;
                  e.currentTarget.style.color = theme.colors.textMain;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "20px",
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
              {(isMobile || !collapsed) && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
