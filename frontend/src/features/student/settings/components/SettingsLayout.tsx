// Master layout — owns active section state, renders sidebar + content pane.
import React, { useState } from "react";
import { theme } from "@/styles/theme";
import { Settings } from "lucide-react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileSection from "./sections/ProfileSection";
import AccountSection from "./sections/AccountSection";
import NotificationsSection from "./sections/NotificationsSection";
import AppearanceSection from "./sections/AppearanceSection";
import type { SettingsSection } from "@/shared/types/settings.types";

const TITLES: Record<SettingsSection, { title: string; subtitle: string }> = {
  profile: {
    title: "Profile",
    subtitle: "Manage your public identity and social links.",
  },
  account: {
    title: "Account",
    subtitle: "Update your preferences and secure your account.",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Control when and how BrainEvo contacts you.",
  },
  appearance: {
    title: "Appearance",
    subtitle: "Personalise your editor and colour scheme.",
  },
};

export default function SettingsLayout() {
  const [active, setActive] = useState<SettingsSection>("profile");
  const { title, subtitle } = TITLES[active];

  const css = `
    /* ── Mobile: stacked ─────────────────────────────────── */
    .sl-wrap    { display: flex; flex-direction: column; }
    .sl-content { width: 100%; }

    /* ── Tablet 640px+: row layout ──────────────────────── */
    @media (min-width: 640px) {
      .sl-wrap    { flex-direction: row; align-items: flex-start; gap: 20px; }
      .sl-content { flex: 1; min-width: 0; }
    }
  `;

  return (
    <div style={{ paddingBottom: "48px" }}>
      <style>{css}</style>

      {/* ── Page header ──────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: "16px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: theme.shadows.sm,
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            flexShrink: 0,
            background: theme.gradients.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: theme.shadows.glowSm,
          }}
        >
          <Settings size={18} color="#fff" />
        </div>
        <div>
          <h1
            style={{
              fontSize: "clamp(17px, 2.5vw, 22px)",
              fontWeight: 800,
              color: theme.colors.textMain,
              margin: 0,
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: theme.colors.textSecondary,
              margin: "2px 0 0",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* ── Sidebar + Content ─────────────────────────────── */}
      <div className="sl-wrap">
        <SettingsSidebar active={active} onChange={setActive} />
        <div className="sl-content">
          {active === "profile" && <ProfileSection />}
          {active === "account" && <AccountSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "appearance" && <AppearanceSection />}
        </div>
      </div>
    </div>
  );
}
