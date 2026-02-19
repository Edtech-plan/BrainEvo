import React from "react";
import { theme } from "@/styles/theme";
import { useAccountSettings } from "../../hooks/useAccountSettings";
import SettingsCard from "../ui/SettingsCard";
import {
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

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
  padding: "10px 14px",
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
const selectStyle: React.CSSProperties = {
  ...inp,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = theme.colors.primary;
  e.currentTarget.style.boxShadow = theme.shadows.input;
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = theme.colors.border;
  e.currentTarget.style.boxShadow = "none";
};

function Banner({ type, msg }: { type: "success" | "error"; msg: string }) {
  const ok = type === "success";
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: theme.borderRadius.md,
        marginTop: "12px",
        backgroundColor: ok ? theme.colors.successBg : theme.colors.errorBg,
        border: `1px solid ${ok ? theme.colors.successBorder : theme.colors.errorBorder}`,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: ok ? theme.colors.successText : theme.colors.errorText,
      }}
    >
      {ok ? (
        <CheckCircle size={14} style={{ flexShrink: 0 }} />
      ) : (
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
      )}
      <span style={{ fontSize: "13px", fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

export default function AccountSection() {
  const {
    account,
    pwForm,
    loading,
    saving,
    pwSaving,
    error,
    pwError,
    success,
    pwSuccess,
    onChange,
    onPwChange,
    onSave,
    onPwSave,
  } = useAccountSettings();
  const [showPw, setShowPw] = React.useState({
    curr: false,
    next: false,
    conf: false,
  });

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <style>{`@keyframes asSk { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
        {[120, 280].map((h, i) => (
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
                animation: "asSk 1.4s infinite",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <style>{`@keyframes asSpin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Locale preferences ───────────────────────────────── */}
      <SettingsCard
        title="Preferences"
        description="Timezone and language settings."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "14px",
          }}
        >
          <div>
            <label htmlFor="timezone" style={label}>Timezone</label>
            <div style={{ position: "relative" }}>
              <Globe
                size={14}
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.colors.textMuted,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <select
                value={account.timezone}
                onChange={(e) => onChange("timezone", e.target.value)}
                style={{ ...selectStyle, paddingLeft: "34px" }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="" disabled>
                  Select timezone
                </option>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="language" style={label}>Language</label>
            <select
              id="language"
              value={account.language}
              onChange={(e) => onChange("language", e.target.value)}
              style={selectStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <Banner type="error" msg={error} />}
        {success && <Banner type="success" msg={success} />}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "10px 24px",
              borderRadius: theme.borderRadius.md,
              border: "none",
              background: saving
                ? theme.colors.bgHover
                : theme.gradients.primary,
              color: saving ? theme.colors.textMuted : "#fff",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: theme.font.sans,
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: `all ${theme.transitions.fast}`,
              boxShadow: saving ? "none" : theme.shadows.glowSm,
            }}
          >
            {saving ? (
              <>
                <Loader2
                  size={13}
                  style={{ animation: "asSpin 1s linear infinite" }}
                />
                Saving…
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </SettingsCard>

      {/* ── Change password ──────────────────────────────────── */}
      <SettingsCard
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
          {(["curr", "next", "conf"] as const).map((key) => {
            const fields = {
              curr: {
                label: "Current Password",
                field: "currentPassword" as const,
                show: showPw.curr,
              },
              next: {
                label: "New Password",
                field: "newPassword" as const,
                show: showPw.next,
              },
              conf: {
                label: "Confirm New Password",
                field: "confirmPassword" as const,
                show: showPw.conf,
              },
            };
            const f = fields[key];
            return (
              <div key={key}>
                <label style={label}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={14}
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: theme.colors.textMuted,
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type={f.show ? "text" : "password"}
                    value={pwForm[f.field]}
                    onChange={(e) => onPwChange(f.field, e.target.value)}
                    placeholder="••••••••"
                    style={{
                      ...inp,
                      paddingLeft: "36px",
                      paddingRight: "40px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary;
                      e.currentTarget.style.boxShadow = theme.shadows.input;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: theme.colors.textMuted,
                      display: "flex",
                      padding: "4px",
                    }}
                    aria-label={f.show ? "Hide password" : "Show password"}
                  >
                    {f.show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {pwError && <Banner type="error" msg={pwError} />}
        {pwSuccess && <Banner type="success" msg={pwSuccess} />}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={onPwSave}
            disabled={pwSaving}
            style={{
              padding: "10px 24px",
              borderRadius: theme.borderRadius.md,
              border: "none",
              background: pwSaving
                ? theme.colors.bgHover
                : theme.gradients.primary,
              color: pwSaving ? theme.colors.textMuted : "#fff",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: theme.font.sans,
              cursor: pwSaving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: `all ${theme.transitions.fast}`,
              boxShadow: pwSaving ? "none" : theme.shadows.glowSm,
            }}
          >
            {pwSaving ? (
              <>
                <Loader2
                  size={13}
                  style={{ animation: "asSpin 1s linear infinite" }}
                />
                Updating…
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </SettingsCard>

      {/* ── Danger zone ──────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.colors.bgCard,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.errorBorder}`,
          overflow: "hidden",
          boxShadow: theme.shadows.sm,
        }}
      >
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${theme.colors.errorBorder}`,
            backgroundColor: "rgba(248,81,73,0.06)",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: theme.colors.error,
              margin: 0,
            }}
          >
            Danger Zone
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: theme.colors.textSecondary,
              margin: "3px 0 0",
            }}
          >
            These actions are permanent and cannot be undone.
          </p>
        </div>
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.colors.textMain,
                margin: 0,
              }}
            >
              Delete Account
            </p>
            <p
              style={{
                fontSize: "12px",
                color: theme.colors.textMuted,
                margin: "3px 0 0",
              }}
            >
              Permanently delete your account and all data.
            </p>
          </div>
          <button
            type="button"
            style={{
              padding: "9px 18px",
              borderRadius: theme.borderRadius.md,
              border: `1.5px solid ${theme.colors.errorBorder}`,
              background: "transparent",
              color: theme.colors.errorText,
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: theme.font.sans,
              transition: `all ${theme.transitions.fast}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.errorBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
