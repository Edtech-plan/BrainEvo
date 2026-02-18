// theme.ts
// ─────────────────────────────────────────────────────────────────────────────
// BrainEvo Design System v4 — Centralized design tokens for the entire app.
//
// Brand Identity: Deep Graphite base + Emerald primary + Amber accent
// Philosophy: Academic precision meets modern SaaS — structured, confident,
//             and instantly recognizable.
//
// Used across: Landing, Student Dashboard, Teacher Dashboard, Auth Pages,
//              Live Class, Assignments, Batches, Analytics, Resources.
//
// v4 Changes:
//   - maxWidth: 1280px → 1360px (better on 1440p+ displays)
//   - Added: bgActive (sidebar active item bg)
//   - Added: sidebarBorder (sidebar right edge separator)
//   - Added: contentPaddingMobile (responsive dashboard padding)
//   - Fixed: textDisabled was too dark (#2d333b → #3d4451)
//   - Added: gradients.infoCard (completes the 4-state card set)
// ─────────────────────────────────────────────────────────────────────────────

export const theme = {
  // ── COLORS ────────────────────────────────────────────────────────────────
  colors: {
    // --- Page & Surface Backgrounds ------------------------------------------
    bgMain: "#0d1117", // Page background — deep graphite
    bgSurface: "#161b22", // Navbars, sidebars, modals
    bgCard: "#1c2333", // Cards, panels, table rows
    bgHover: "#21293a", // Hover states — nav links, list items, rows
    bgActive: "#1a2540", // ✅ NEW — active sidebar item, selected row
    bgInput: "#1a2133", // Form inputs, search bars, textareas
    bgOverlay: "rgba(0, 0, 0, 0.65)", // Modal + drawer backdrops

    // --- Brand Primary: Emerald ----------------------------------------------
    primary: "#10b981", // Emerald 500 — main brand CTA, active states
    primaryLight: "#d1fae5", // Emerald 100 — light badges (light mode future)
    primaryDark: "#059669", // Emerald 600 — hover/pressed buttons
    primaryFaint: "rgba(16, 185, 129, 0.10)", // Badge/pill bg tint
    primaryGlow: "rgba(16, 185, 129, 0.25)", // Glow / focus ring effects

    // --- Brand Accent: Warm Amber --------------------------------------------
    accent: "#f59e0b", // Amber 500 — secondary highlights, streaks
    accentDark: "#d97706", // Amber 600 — hover on accent elements
    accentFaint: "rgba(245, 158, 11, 0.10)", // Subtle amber tint
    accentGlow: "rgba(245, 158, 11, 0.20)", // Amber glow for badges

    // --- Text Hierarchy ------------------------------------------------------
    textMain: "#e6edf3", // Near-white — headings, primary labels
    textSecondary: "#8b949e", // Muted grey — descriptions, subtitles
    textMuted: "#484f58", // Dim — timestamps, placeholders
    textDisabled: "#3d4451", // ✅ FIXED (was #2d333b — too dark, unreadable)
    textInverse: "#0d1117", // Text on light/brand-colored backgrounds

    // --- Borders & Dividers --------------------------------------------------
    border: "#21293a", // Default — cards, inputs, table rows
    borderLight: "#30363d", // Slightly visible — active input, focused card
    borderFocus: "#10b981", // Emerald focus ring on inputs
    sidebarBorder: "#1a2133", // ✅ NEW — sidebar right-edge separator

    // --- Semantic: Success ---------------------------------------------------
    success: "#10b981",
    successBg: "#0a2e1e",
    successText: "#6ee7b7",
    successBorder: "rgba(16, 185, 129, 0.25)",

    // --- Semantic: Warning ---------------------------------------------------
    warning: "#f59e0b",
    warningBg: "#2d1e00",
    warningText: "#fcd34d",
    warningBorder: "rgba(245, 158, 11, 0.25)",

    // --- Semantic: Error -----------------------------------------------------
    error: "#f85149",
    errorBg: "#2d1216",
    errorText: "#ffa198",
    errorBorder: "rgba(248, 81, 73, 0.25)",

    // --- Semantic: Info ------------------------------------------------------
    info: "#58a6ff",
    infoBg: "#0c1a2e",
    infoText: "#a5c8ff",
    infoBorder: "rgba(88, 166, 255, 0.25)",

    // --- Chart / Data Visualization ------------------------------------------
    chartEmerald: "#10b981", // Primary metric
    chartAmber: "#f59e0b", // Secondary metric
    chartBlue: "#58a6ff", // Tertiary metric
    chartRose: "#fb7185", // Danger / drop metric
    chartViolet: "#a78bfa", // Optional 5th series
    chartTeal: "#2dd4bf", // Completion / streak

    // --- Role Badges ---------------------------------------------------------
    roleBadgeStudent: "rgba(16, 185, 129, 0.12)",
    roleBadgeTeacher: "rgba(245, 158, 11, 0.12)",
  },

  // ── GRADIENTS ──────────────────────────────────────────────────────────────
  gradients: {
    // Core brand
    primary: "linear-gradient(135deg, #10b981, #0d9488)",
    primaryReverse: "linear-gradient(135deg, #0d9488, #10b981)",

    // Hero section
    hero: "linear-gradient(160deg, #0d1117 0%, #0f1f18 50%, #0d1117 100%)",

    // Card border glow
    cardBorder:
      "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(13,148,136,0.15))",

    // Animated shimmer for gradient text
    shimmerText: "linear-gradient(90deg, #10b981, #2dd4bf, #f59e0b, #10b981)",

    // Radial glows
    glowCenter:
      "radial-gradient(ellipse at center, rgba(16,185,129,0.18) 0%, transparent 68%)",
    glowAmber:
      "radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 65%)",

    // Dashboard stat cards — one per semantic state
    sidebarActive:
      "linear-gradient(90deg, rgba(16,185,129,0.18), rgba(16,185,129,0.04))",
    statCard:
      "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(13,148,136,0.05))",
    warningCard:
      "linear-gradient(135deg, rgba(245,158,11,0.10), rgba(245,158,11,0.04))",
    dangerCard:
      "linear-gradient(135deg, rgba(248,81,73,0.10), rgba(245,158,11,0.04))",
    successCard:
      "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(45,212,191,0.05))",
    infoCard:
      "linear-gradient(135deg, rgba(88,166,255,0.10), rgba(88,166,255,0.04))", // ✅ NEW
  },

  // ── SHADOWS ────────────────────────────────────────────────────────────────
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.4)",
    md: "0 4px 12px rgba(0,0,0,0.4)",
    lg: "0 10px 30px rgba(0,0,0,0.5)",
    xl: "0 24px 60px rgba(0,0,0,0.6)",
    card: "0 4px 20px rgba(0,0,0,0.35)",
    modal: "0 28px 80px rgba(0,0,0,0.7)",
    glow: "0 0 40px rgba(16, 185, 129, 0.3)",
    glowSm: "0 0 20px rgba(16, 185, 129, 0.2)",
    glowAmber: "0 0 30px rgba(245, 158, 11, 0.2)",
    input: "0 0 0 3px rgba(16, 185, 129, 0.2)", // focus ring
  },

  // ── BORDER RADIUS ──────────────────────────────────────────────────────────
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "24px",
    card: "16px",
    full: "9999px",
  },

  // ── SIZES ──────────────────────────────────────────────────────────────────
  sizes: {
    headerHeight: "72px",
    sidebarWidth: "256px",
    sidebarCollapsedWidth: "68px",
    maxWidth: "1360px", // ✅ FIXED (was 1280px — too narrow on 1440p)
    contentPadding: "24px",
    contentPaddingMobile: "16px", // ✅ NEW — use on <640px for dashboard pages
  },

  // ── TYPOGRAPHY ─────────────────────────────────────────────────────────────
  font: {
    sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "Courier New", monospace',
    display: '"Inter", sans-serif',
  },

  // ── TRANSITIONS ────────────────────────────────────────────────────────────
  transitions: {
    fast: "150ms ease",
    base: "250ms ease",
    slow: "400ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  // ── Z-INDEX SCALE ──────────────────────────────────────────────────────────
  // Named tokens — prevents z-index wars across components.
  // Usage: style={{ zIndex: theme.zIndex.header }}
  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    header: 300,
    modal: 400,
    toast: 500,
  },
};

export type Theme = typeof theme;
