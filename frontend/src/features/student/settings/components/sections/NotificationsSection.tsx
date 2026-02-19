import React from "react";
import { theme } from "@/styles/theme";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import SettingsCard from "../ui/SettingsCard";
import SettingsRow from "../ui/SettingsRow";
import ToggleSwitch from "../ui/ToggleSwitch";
import {
  BookOpen,
  Star,
  Video,
  Megaphone,
  MoonStar,
  AlertCircle,
} from "lucide-react";
import type {
  NotificationsData,
  NotificationChannel,
} from "@/shared/types/settings.types";

type NotifKey = keyof Omit<NotificationsData, "quietHours">;
type ChannelKey = keyof NotificationChannel;

// ── Channel sub-row (Email / In-App toggles) ──────────────────────────────────
function ChannelRow({
  label,
  emailOn,
  inAppOn,
  onEmail,
  onInApp,
  last,
}: {
  label: string;
  emailOn: boolean;
  inAppOn: boolean;
  onEmail: () => void;
  onInApp: () => void;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: "11px 0 11px 46px",
        borderBottom: last ? "none" : `1px solid ${theme.colors.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: theme.colors.textSecondary,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "11px",
              color: theme.colors.textMuted,
              fontWeight: 600,
            }}
          >
            Email
          </span>
          <ToggleSwitch
            checked={emailOn}
            onChange={onEmail}
            label={`${label} email`}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontSize: "11px",
              color: theme.colors.textMuted,
              fontWeight: 600,
            }}
          >
            In-App
          </span>
          <ToggleSwitch
            checked={inAppOn}
            onChange={onInApp}
            label={`${label} in-app`}
          />
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NotificationsSection() {
  const {
    prefs,
    loading,
    error,
    onToggle,
    onQuietHoursToggle,
    onQuietHoursChange,
  } = useNotificationSettings();

  const toggle = (key: NotifKey, ch: ChannelKey) => () => onToggle(key, ch);

  const timeInp: React.CSSProperties = {
    padding: "7px 10px",
    borderRadius: theme.borderRadius.md,
    border: `1.5px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.bgInput,
    color: theme.colors.textMain,
    fontSize: "13px",
    fontFamily: theme.font.sans,
    outline: "none",
    width: "110px",
    cursor: "pointer",
    transition: `border-color ${theme.transitions.fast}`,
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <style>{`@keyframes nsSk { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
        {[160, 200, 140, 120].map((h, i) => (
          <div
            key={i}
            style={{
              height: `${h}px`,
              backgroundColor: theme.colors.bgCard,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)",
                animation: "nsSk 1.4s infinite",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  const groups: {
    key: NotifKey;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "liveClassReminders",
      label: "Live Class Reminders",
      desc: "Get notified before a class starts.",
      icon: <Video size={16} />,
    },
    {
      key: "assignmentCreated",
      label: "New Assignments",
      desc: "When a new assignment is posted.",
      icon: <BookOpen size={16} />,
    },
    {
      key: "gradeReleased",
      label: "Grade Published",
      desc: "When your work is graded.",
      icon: <Star size={16} />,
    },
    {
      key: "announcements",
      label: "Announcements",
      desc: "School-wide or course announcements.",
      icon: <Megaphone size={16} />,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.errorBg,
            border: `1px solid ${theme.colors.errorBorder}`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: theme.colors.errorText,
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{error}</span>
        </div>
      )}

      {/* ── Channel column headers ───────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "0",
          gap: "32px",
        }}
      >
        {["Email", "In-App"].map((ch) => (
          <span
            key={ch}
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: theme.colors.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              width: "68px",
              textAlign: "center",
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* ── Per-event groups ─────────────────────────────────── */}
      {groups.map((g) => (
        <SettingsCard key={g.key} title={g.label} description={g.desc}>
          <ChannelRow
            label="Notifications"
            emailOn={prefs[g.key].email}
            inAppOn={prefs[g.key].inApp}
            onEmail={toggle(g.key, "email")}
            onInApp={toggle(g.key, "inApp")}
            last
          />
        </SettingsCard>
      ))}

      {/* ── Quiet Hours ──────────────────────────────────────── */}
      <SettingsCard
        title="Quiet Hours"
        description="Suppress all notifications during a time window."
      >
        <SettingsRow
          icon={<MoonStar size={16} />}
          label="Enable Quiet Hours"
          description={
            prefs.quietHours.enabled
              ? `Active ${prefs.quietHours.start} – ${prefs.quietHours.end}`
              : "No notifications will be sent during this window"
          }
          control={
            <ToggleSwitch
              checked={prefs.quietHours.enabled}
              onChange={onQuietHoursToggle}
              label="Enable quiet hours"
            />
          }
        />
        {prefs.quietHours.enabled && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: theme.colors.textSecondary,
                fontWeight: 500,
                minWidth: "35px",
              }}
            >
              From
            </span>
            <input
              type="time"
              value={prefs.quietHours.start}
              onChange={(e) => onQuietHoursChange("start", e.target.value)}
              style={timeInp}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            />
            <span
              style={{
                fontSize: "13px",
                color: theme.colors.textSecondary,
                fontWeight: 500,
              }}
            >
              to
            </span>
            <input
              type="time"
              value={prefs.quietHours.end}
              onChange={(e) => onQuietHoursChange("end", e.target.value)}
              style={timeInp}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            />
          </div>
        )}
      </SettingsCard>
    </div>
  );
}
