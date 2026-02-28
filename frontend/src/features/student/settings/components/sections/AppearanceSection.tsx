import React from "react";
import { theme } from "@/styles/theme";
import { useAppearanceSettings } from "../../hooks/useAppearanceSettings";
import SettingsCard from "../ui/SettingsCard";
import {
  Monitor,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle,
  Loader2,
  Type,
  Keyboard,
} from "lucide-react";

// ── Radio pill group ──────────────────────────────────────────────────────────
function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 16px",
              borderRadius: theme.borderRadius.md,
              border: `1.5px solid ${active ? theme.colors.primary : theme.colors.border}`,
              backgroundColor: active
                ? theme.colors.primaryFaint
                : theme.colors.bgHover,
              color: active ? theme.colors.primary : theme.colors.textSecondary,
              fontSize: "13px",
              fontWeight: active ? 700 : 500,
              fontFamily: theme.font.sans,
              cursor: "pointer",
              transition: `all ${theme.transitions.fast}`,
              boxShadow: active ? theme.shadows.glowSm : "none",
            }}
            onMouseEnter={(e) => {
              if (!active)
                e.currentTarget.style.borderColor = theme.colors.borderLight;
            }}
            onMouseLeave={(e) => {
              if (!active)
                e.currentTarget.style.borderColor = theme.colors.border;
            }}
            aria-pressed={active}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AppearanceSection() {
  const { appearance, loading, saving, error, success, onChange, onSave } =
    useAppearanceSettings();

  const label: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "10px",
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <style>{`@keyframes apSk { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
        {[140, 130, 120].map((h, i) => (
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
                animation: "apSk 1.4s infinite",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <style>{`@keyframes apSpin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Theme ───────────────────────────────────────────── */}
      <SettingsCard
        title="Theme"
        description="Choose your preferred colour scheme."
      >
        <label htmlFor="appearance-theme" style={label}>
          Colour Scheme
        </label>
        <PillGroup
          value={appearance.theme}
          onChange={(v) => onChange("theme", v)}
          options={[
            { value: "dark", label: "Dark", icon: <Moon size={14} /> },
            { value: "light", label: "Light", icon: <Sun size={14} /> },
            { value: "system", label: "System", icon: <Monitor size={14} /> },
          ]}
        />
      </SettingsCard>

      {/* ── Editor font size ─────────────────────────────────── */}
      <SettingsCard
        title="Editor"
        description="Code editor and assignment editor preferences."
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={label}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Type size={13} /> Font Size — {appearance.editorFontSize}px
            </span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
              12
            </span>
            <input
              type="range"
              min={12}
              max={20}
              step={1}
              value={appearance.editorFontSize}
              onChange={(e) =>
                onChange("editorFontSize", Number(e.target.value))
              }
              style={{
                flex: 1,
                accentColor: theme.colors.primary,
                cursor: "pointer",
              }}
              aria-label="Editor font size"
            />
            <span style={{ fontSize: "12px", color: theme.colors.textMuted }}>
              20
            </span>
          </div>
          {/* Live preview */}
          <div
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              backgroundColor: theme.colors.bgHover,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              fontFamily: theme.font.mono,
              fontSize: `${appearance.editorFontSize}px`,
              color: theme.colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: theme.colors.primary }}>const</span>{" "}
            <span style={{ color: "#79c0ff" }}>greet</span>{" "}
            <span style={{ color: theme.colors.textMuted }}>=</span>{" "}
            <span style={{ color: theme.colors.accent }}>
              "Hello, BrainEvo!"
            </span>
            ;
          </div>
        </div>

        {/* Keymap */}
        <div>
          <label
            htmlFor="editor-keymap"
            style={{
              ...label,
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Keyboard size={13} /> Keymap
          </label>
          <PillGroup
            value={appearance.editorKeymap}
            onChange={(v) => onChange("editorKeymap", v)}
            options={[
              { value: "vscode", label: "VS Code" },
              { value: "vim", label: "Vim" },
              { value: "emacs", label: "Emacs" },
            ]}
          />
        </div>
      </SettingsCard>

      {/* Feedback */}
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
          <AlertCircle size={14} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{error}</span>
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.successBg,
            border: `1px solid ${theme.colors.successBorder}`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: theme.colors.successText,
          }}
        >
          <CheckCircle size={14} />
          <span style={{ fontSize: "13px", fontWeight: 500 }}>{success}</span>
        </div>
      )}

      {/* Save CTA */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={{
            padding: "11px 28px",
            borderRadius: theme.borderRadius.md,
            border: "none",
            background: saving ? theme.colors.bgHover : theme.gradients.primary,
            color: saving ? theme.colors.textMuted : "#fff",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: theme.font.sans,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: `all ${theme.transitions.fast}`,
            boxShadow: saving ? "none" : theme.shadows.glowSm,
          }}
        >
          {saving ? (
            <>
              <Loader2
                size={14}
                style={{ animation: "apSpin 1s linear infinite" }}
              />
              Saving…
            </>
          ) : (
            "Save Appearance"
          )}
        </button>
      </div>
    </div>
  );
}
