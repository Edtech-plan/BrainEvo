import React from "react";
import { theme } from "@/styles/theme";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import SettingsCard from "../ui/SettingsCard";
import AvatarUpload from "../ui/AvatarUpload";
import {
  User,
  Phone,
  Globe,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ── Shared input styling ──────────────────────────────────────────────────────
const label: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: theme.colors.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "6px",
};
const inp: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px 10px 38px",
  borderRadius: theme.borderRadius.md,
  border: `1.5px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.bgInput,
  color: theme.colors.textMain,
  fontSize: "14px",
  fontFamily: theme.font.sans,
  outline: "none",
  transition: `border-color ${theme.transitions.fast}`,
  boxSizing: "border-box",
};
const icon: React.CSSProperties = {
  position: "absolute",
  left: "11px",
  top: "50%",
  transform: "translateY(-50%)",
  color: theme.colors.textMuted,
  pointerEvents: "none",
};
const onFocus = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.borderColor = theme.colors.primary;
  e.currentTarget.style.boxShadow = theme.shadows.input;
};
const onBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  e.currentTarget.style.borderColor = theme.colors.border;
  e.currentTarget.style.boxShadow = "none";
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <style>{`@keyframes skShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
      {[180, 240].map((h, i) => (
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
              animation: "skShimmer 1.4s infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Feedback banner ───────────────────────────────────────────────────────────
function Banner({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const isSuccess = type === "success";
  return (
    <div
      style={{
        padding: "11px 16px",
        borderRadius: theme.borderRadius.md,
        backgroundColor: isSuccess
          ? theme.colors.successBg
          : theme.colors.errorBg,
        border: `1px solid ${isSuccess ? theme.colors.successBorder : theme.colors.errorBorder}`,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: isSuccess ? theme.colors.successText : theme.colors.errorText,
      }}
    >
      {isSuccess ? (
        <CheckCircle size={15} style={{ flexShrink: 0 }} />
      ) : (
        <AlertCircle size={15} style={{ flexShrink: 0 }} />
      )}
      <span style={{ fontSize: "13px", fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileSection() {
  const {
    form,
    email,
    loading,
    saving,
    uploading,
    error,
    success,
    isDirty,
    onChange,
    onSocialChange,
    onAvatarChange,
    onSave,
  } = useProfileSettings();

  if (loading) return <Skeleton />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <style>{`@keyframes psSpin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Public Profile card ──────────────────────────────────── */}
      <SettingsCard
        title="Public Profile"
        description="Visible to your instructors and classmates."
      >
        {/* Avatar */}
        <div
          style={{
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <AvatarUpload
            avatarUrl={form.avatarUrl}
            fullName={form.fullName}
            onFileSelect={onAvatarChange}
            uploading={uploading}
          />
        </div>

        {/* Name + Phone grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "14px",
          }}
        >
          <div>
            <label htmlFor="fullName" style={label}>
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <User size={14} style={icon} />
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => onChange("fullName", e.target.value)}
                placeholder="Your full name"
                style={inp}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" style={label}>
              Phone
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={14} style={icon} />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
                style={inp}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "14px" }}>
          <label style={label}>
            Headline
            <span
              style={{
                fontSize: "11px",
                fontWeight: 400,
                color: theme.colors.textMuted,
                textTransform: "none",
                letterSpacing: 0,
                marginLeft: "6px",
              }}
            >
              ({200 - (form.headline?.length ?? 0)} left)
            </span>
          </label>
          <textarea
            value={form.headline}
            onChange={(e) => onChange("headline", e.target.value.slice(0, 200))}
            placeholder="e.g. Full-Stack Developer | BrainEvo Student"
            rows={3}
            maxLength={200}
            style={{
              ...inp,
              paddingLeft: "12px",
              resize: "vertical",
              lineHeight: 1.6,
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {/* Email — read-only */}
        <div>
          <label htmlFor="email" style={label}>
            Email Address
          </label>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: theme.borderRadius.md,
              border: `1.5px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.bgHover,
              fontSize: "14px",
              color: theme.colors.textMuted,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <span>{email}</span>
            <span
              style={{
                fontSize: "11px",
                color: theme.colors.textMuted,
                backgroundColor: theme.colors.bgCard,
                padding: "2px 8px",
                borderRadius: "4px",
                border: `1px solid ${theme.colors.border}`,
                flexShrink: 0,
              }}
            >
              Change in Account →
            </span>
          </div>
        </div>
      </SettingsCard>

      {/* ── Social Links card ────────────────────────────────────── */}
      <SettingsCard
        title="Social Links"
        description="Add links to your professional profiles."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label htmlFor="linkedin" style={label}>
              LinkedIn
            </label>
            <div style={{ position: "relative" }}>
              <Linkedin size={14} style={icon} />
              <input
                id="linkedin"
                type="url"
                value={form.socialLinks.linkedin}
                onChange={(e) => onSocialChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                style={inp}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>
          <div>
            <label htmlFor="portfolio" style={label}>
              Portfolio
            </label>
            <div style={{ position: "relative" }}>
              <Globe size={14} style={icon} />
              <input
                id="portfolio"
                type="url"
                value={form.socialLinks.portfolio}
                onChange={(e) => onSocialChange("portfolio", e.target.value)}
                placeholder="https://yourportfolio.dev"
                style={inp}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Feedback banners */}
      {error && <Banner type="error" message={error} />}
      {success && <Banner type="success" message={success} />}

      {/* Save CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onSave}
          disabled={saving || !isDirty}
          style={{
            padding: "11px 28px",
            borderRadius: theme.borderRadius.md,
            border: "none",
            background:
              saving || !isDirty
                ? theme.colors.bgHover
                : theme.gradients.primary,
            color: saving || !isDirty ? theme.colors.textMuted : "#fff",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: theme.font.sans,
            cursor: saving || !isDirty ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: `all ${theme.transitions.fast}`,
            boxShadow: saving || !isDirty ? "none" : theme.shadows.glowSm,
          }}
        >
          {saving ? (
            <>
              <Loader2
                size={14}
                style={{ animation: "psSpin 1s linear infinite" }}
              />
              Saving…
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </div>
  );
}
