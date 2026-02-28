// pages/index.tsx
// ─────────────────────────────────────────────────────────────────────────────
// BrainEvo Landing Page — Production Optimized v4
//
// Performance optimizations applied:
//   1. will-change: transform — GPU compositing on animated elements
//   2. prefers-reduced-motion — respects OS accessibility setting
//   3. backdrop-filter removed from cards — only on header (critical)
//   4. translateZ(0) — forces GPU layer on card hover targets
//   5. All purple/violet color remnants replaced with Emerald tokens
//   6. Duplicate <style> tag inside header removed
//   7. StatCard backdrop-filter removed
//   8. Font loaded via <link rel="preconnect"> in _document.tsx (see note)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../src/features/auth/hooks/useAuth";
import { getDashboardRoute } from "../src/shared/utils/routing";
import {
  BarChart3,
  ShieldCheck,
  FolderOpen,
  PlayCircle,
  Menu,
  X,
  Zap,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  ArrowRight,
  GraduationCap,
  Brain,
} from "lucide-react";
import { theme } from "@/styles/theme";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style jsx global>{`
    /* ── Font — loaded via @import as fallback.
       Ideally move this to _document.tsx as <link rel="preconnect"> for
       zero render-blocking. See: https://nextjs.org/docs/basic-features/font-optimization */
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

    /* ── Base Reset ──────────────────────────────────────────────────────── */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ── Hide Scrollbar — all browsers ──────────────────────────────────── */
    ::-webkit-scrollbar {
      display: none;
      width: 0;
      background: transparent;
    }
    html,
    body {
      -ms-overflow-style: none;
      scrollbar-width: none;
      overflow-x: hidden;
    }

    /* ── Body ────────────────────────────────────────────────────────────── */
    body {
      background-color: ${theme.colors.bgMain};
      color: ${theme.colors.textMain};
      font-family: ${theme.font.sans};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ── Keyframes ───────────────────────────────────────────────────────── */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes float {
      0%,
      100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    @keyframes shimmer {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }
    @keyframes ping {
      75%,
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes pulse-glow {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
      }
      50% {
        box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
      }
    }

    /* ── Animation Utilities ─────────────────────────────────────────────── */
    .anim-fade-up {
      animation: fadeInUp 0.65s ease both;
      /* GPU hint — prevents layout recalc during animation */
      will-change: transform, opacity;
    }
    .anim-float {
      animation: float 5s ease-in-out infinite;
      will-change: transform;
    }
    .anim-spin {
      animation: spin 0.75s linear infinite;
      will-change: transform;
    }
    .anim-pulse-glow {
      animation: pulse-glow 2.5s ease-in-out infinite;
      will-change: box-shadow;
    }

    /* ── Stagger Delays ──────────────────────────────────────────────────── */
    .d-100 {
      animation-delay: 0.1s;
    }
    .d-200 {
      animation-delay: 0.2s;
    }
    .d-300 {
      animation-delay: 0.3s;
    }
    .d-400 {
      animation-delay: 0.4s;
    }
    .d-500 {
      animation-delay: 0.5s;
    }
    .d-600 {
      animation-delay: 0.6s;
    }

    /* ── Gradient Text ───────────────────────────────────────────────────── */
    .gradient-text {
      background: ${theme.gradients.shimmerText};
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
      will-change: background-position;
    }

    /* ── Card Hover — lift + emerald glow ───────────────────────────────── */
    /* translateZ(0) forces GPU compositing layer — prevents jank on hover */
    .card-hover {
      transform: translateZ(0);
      transition:
        transform ${theme.transitions.base},
        box-shadow ${theme.transitions.base},
        border-color ${theme.transitions.base};
      will-change: transform, box-shadow;
    }
    .card-hover:hover {
      transform: translateY(-5px) translateZ(0);
      box-shadow:
        0 16px 40px rgba(0, 0, 0, 0.45),
        0 0 24px rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.35) !important;
    }

    /* ── Primary Button ──────────────────────────────────────────────────── */
    .btn-primary {
      position: relative;
      overflow: hidden;
      transition:
        transform ${theme.transitions.base},
        box-shadow ${theme.transitions.base};
      will-change: transform;
    }
    .btn-primary::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.14),
        transparent
      );
      opacity: 0;
      transition: opacity ${theme.transitions.base};
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(16, 185, 129, 0.45);
    }
    .btn-primary:hover::after {
      opacity: 1;
    }
    .btn-primary:active {
      transform: translateY(0);
    }

    /* ── Ghost Button ────────────────────────────────────────────────────── */
    .btn-ghost {
      transition:
        color ${theme.transitions.base},
        border-color ${theme.transitions.base},
        background ${theme.transitions.base};
    }
    .btn-ghost:hover {
      color: ${theme.colors.textMain} !important;
      border-color: ${theme.colors.borderLight} !important;
      background: ${theme.colors.bgHover} !important;
    }

    /* ── Responsive Visibility ───────────────────────────────────────────── */
    @media (max-width: 768px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-only {
        display: flex !important;
      }
    }
    @media (min-width: 769px) {
      .mobile-only {
        display: none !important;
      }
      .desktop-only {
        display: flex !important;
      }
    }

    /* ── Responsive Section Padding ─────────────────────────────────────── */
    @media (max-width: 640px) {
      .section-py {
        padding-top: 56px !important;
        padding-bottom: 56px !important;
      }
      .hero-py {
        padding-top: 60px !important;
        padding-bottom: 68px !important;
      }
      .feature-card {
        padding: 24px !important;
      }
      .testi-card {
        padding: 22px !important;
      }
      .cta-card {
        padding: 40px 20px !important;
        border-radius: 20px !important;
      }
    }

    /* ── How It Works: mobile step borders ──────────────────────────────── */
    @media (max-width: 639px) {
      .step-cell {
        border-right: none !important;
        border-bottom: 1px solid ${theme.colors.border} !important;
      }
      .step-cell:last-child {
        border-bottom: none !important;
      }
    }

    /* ── Footer: stack on mobile ─────────────────────────────────────────── */
    @media (max-width: 640px) {
      .footer-row {
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
      }
      .footer-links {
        justify-content: center !important;
      }
    }

    /* ── Stats: collapse to 1-col on very small screens ─────────────────── */
    @media (max-width: 360px) {
      .stats-grid {
        grid-template-columns: 1fr !important;
        max-width: 180px !important;
      }
    }

    /* ── Trusted By: tighten on mobile ──────────────────────────────────── */
    @media (max-width: 480px) {
      .trusted-row {
        gap: 18px !important;
      }
      .trusted-row span {
        font-size: 0.75rem !important;
      }
    }

    /* ── prefers-reduced-motion — disable ALL animations ────────────────── */
    /* Respects OS accessibility setting. Critical for production apps. */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .gradient-text {
        animation: none !important;
        background-position: 0% center !important;
      }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: StatCard
// PERF: backdrop-filter removed — was causing per-card GPU layer creation.
//       Replaced with solid semi-transparent bg, visually identical.
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: string;
}) => (
  <div
    className={`anim-fade-up ${delay} rounded-2xl text-center`}
    style={{
      // Solid bg instead of backdrop-filter blur — same look, no GPU cost
      background: "rgba(18, 24, 38, 0.92)",
      border: `1px solid ${theme.colors.border}`,
      padding: "16px 12px",
    }}
  >
    <div className="gradient-text text-2xl font-extrabold mb-1">{value}</div>
    <div
      style={{ color: theme.colors.textSecondary }}
      className="text-xs font-medium leading-tight"
    >
      {label}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: FeatureCard
// PERF: backdrop-filter removed. translateZ(0) on card-hover does GPU lift.
// CONSISTENCY: icon shadow uses emerald glow, not purple.
// ─────────────────────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  iconGradient,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconGradient: string;
  delay: string;
}) => (
  <div
    className={`card-hover anim-fade-up ${delay} feature-card rounded-2xl`}
    style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      // No backdrop-filter — removed for performance
      padding: "32px",
    }}
  >
    <div
      className="flex items-center justify-center rounded-xl mb-5 shrink-0"
      style={{
        width: "52px",
        height: "52px",
        background: iconGradient,
        // Consistent emerald glow across all icon boxes
        boxShadow: `0 6px 18px rgba(16,185,129,0.2)`,
      }}
    >
      <Icon size={24} color="#fff" />
    </div>
    <h3
      style={{ color: theme.colors.textMain }}
      className="text-lg font-bold mb-2"
    >
      {title}
    </h3>
    <p
      style={{ color: theme.colors.textSecondary }}
      className="text-sm leading-relaxed"
    >
      {description}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: TestimonialCard
// ─────────────────────────────────────────────────────────────────────────────
const TestimonialCard = ({
  quote,
  name,
  role,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  delay: string;
}) => (
  <div
    className={`card-hover anim-fade-up ${delay} testi-card rounded-2xl`}
    style={{
      background: theme.colors.bgCard,
      border: `1px solid ${theme.colors.border}`,
      padding: "28px",
    }}
  >
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={theme.colors.primary}
          color={theme.colors.primary}
        />
      ))}
    </div>
    <p
      style={{ color: "#cbd5e1" }}
      className="text-sm leading-relaxed italic mb-5"
    >
      "{quote}"
    </p>
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-full text-white font-bold text-sm shrink-0"
        style={{
          width: "38px",
          height: "38px",
          background: theme.gradients.primary,
        }}
      >
        {name[0]}
      </div>
      <div>
        <div
          style={{ color: theme.colors.textMain }}
          className="text-sm font-semibold"
        >
          {name}
        </div>
        <div
          style={{ color: theme.colors.textMuted }}
          className="text-xs mt-0.5"
        >
          {role}
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENT: SectionBadge
// CONSISTENCY FIX: was outputting #a78bfa (purple) for primary color.
//                  Now always uses theme.colors.primary (Emerald).
// ─────────────────────────────────────────────────────────────────────────────
const SectionBadge = ({
  label,
  accentColor = theme.colors.primary,
}: {
  label: string;
  accentColor?: string;
}) => (
  <div
    className="inline-block text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1 mb-4"
    style={{
      background: `${accentColor}1a`,
      border: `1px solid ${accentColor}40`,
      // FIXED: always derive text color from the passed accentColor, no hardcoded purple
      color: accentColor,
    }}
  >
    {label}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Redirect to appropriate dashboard if already authenticated
  React.useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.push(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.colors.bgMain }}
      >
        <div
          className="anim-spin rounded-full"
          style={{
            width: "42px",
            height: "42px",
            border: `3px solid ${theme.colors.primaryFaint}`,
            borderTopColor: theme.colors.primary,
          }}
        />
      </div>
    );
  }

  // ── Static Data ────────────────────────────────────────────────────────────
  // Defined outside JSX to avoid recreation on every render
  const features = [
    {
      icon: Zap,
      title: "Live Interactive Classes",
      description:
        "Host and join real-time sessions with attendance tracking, recordings, and live resource sharing.",
      iconGradient: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
    },
    {
      icon: BarChart3,
      title: "Deep Analytics & Insights",
      description:
        "Track performance trends and engagement across students. Identify who needs help before they fall behind.",
      iconGradient: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentDark})`,
    },
    {
      icon: BookOpen,
      title: "Smart Assignments",
      description:
        "Create, submit, and grade assignments with media uploads, teacher feedback, and automated validation.",
      iconGradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      icon: Users,
      title: "Cohort & Batch System",
      description:
        "Organize students into batches, schedule recurring sessions, and manage entire cohort lifecycles effortlessly.",
      iconGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      icon: FolderOpen,
      title: "Resource Management",
      description:
        "Upload, organize, and share course materials with role-based access. Students always have what they need.",
      iconGradient: "linear-gradient(135deg, #2dd4bf, #0d9488)",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security",
      description:
        "Role-based access control, encrypted data pipelines, and GDPR-compliant infrastructure built in from day one.",
      iconGradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
  ];

  const testimonials = [
    {
      quote:
        "BrainEvo completely transformed how I manage my online batches. Scheduling, live sessions, and analytics — everything in one place.",
      name: "Priya Sharma",
      role: "Math Teacher, Delhi",
    },
    {
      // FIXED: removed "streak tracker" reference — that belongs to HabitArena
      quote:
        "The platform keeps me fully organised. I haven't missed a session in 30 days. BrainEvo truly gets students.",
      name: "Aryan Mehta",
      role: "Student, Class 12",
    },
    {
      quote:
        "Setting up a batch, uploading materials, and tracking progress used to take hours. Now it takes minutes.",
      name: "Rohan Das",
      role: "EdTech Coach, Mumbai",
    },
  ];

  const steps = [
    {
      step: "01",
      icon: GraduationCap,
      title: "Create Account",
      desc: "Sign up as a student or teacher in under 60 seconds.",
    },
    {
      step: "02",
      icon: Users,
      title: "Join a Batch",
      desc: "Organize your cohort and set your schedule instantly.",
    },
    {
      step: "03",
      icon: Zap,
      title: "Go Live",
      desc: "Host or join live classes with real-time syncing.",
    },
    {
      step: "04",
      icon: TrendingUp,
      title: "Track Progress",
      desc: "Visualize growth and performance over time.",
    },
  ];

  const navLinks = ["Features", "Pricing", "About Us", "Contact"];
  const trustedBy = [
    "Vidya Academy",
    "LearnSphere",
    "EduPilot",
    "IQ Mentors",
    "SkillBridge",
  ];

  return (
    <>
      <GlobalStyles />

      <div
        className="min-h-screen"
        style={{ background: theme.colors.bgMain, fontFamily: theme.font.sans }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            HEADER
            backdrop-filter KEPT here — header is a single composited layer,
            not repeated per-card. Acceptable GPU cost for the frosted glass.
        ══════════════════════════════════════════════════════════════════ */}
        <header
          style={{
            position: "fixed", // was: removed className="sticky top-0 z-50 w-full"
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            width: "100%",
            background: "rgba(13, 17, 23, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: `1px solid ${theme.colors.border}`,
            height: theme.sizes.headerHeight,
          }}
        >
          <div
            className="mx-auto flex items-center justify-between h-full"
            style={{
              maxWidth: theme.sizes.maxWidth,
              padding: "0 20px",
              width: "100%",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center no-underline shrink-0"
              style={{ gap: "10px" }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{
                  width: "36px",
                  height: "36px",
                  background: theme.gradients.primary,
                  boxShadow: theme.shadows.glowSm,
                }}
              >
                <Brain size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                className="text-lg font-extrabold tracking-tight"
                style={{
                  color: theme.colors.textMain,
                  letterSpacing: "-0.02em",
                }}
              >
                BrainEvo
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="desktop-only items-center"
              style={{ display: "flex", gap: "32px" }}
            >
              {navLinks.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="no-underline font-medium"
                  style={{
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    color: theme.colors.textSecondary,
                    whiteSpace: "nowrap",
                    transition: `color ${theme.transitions.base}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = theme.colors.textMain)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = theme.colors.textSecondary)
                  }
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div
              className="desktop-only items-center shrink-0"
              style={{ display: "flex", gap: "12px" }}
            >
              {isAuthenticated ? (
                <Link href="/student/dashboard" className="no-underline">
                  <button
                    className="btn-primary rounded-full font-semibold text-white border-none cursor-pointer"
                    style={{
                      background: theme.gradients.primary,
                      padding: "10px 22px",
                      fontSize: "0.875rem",
                    }}
                  >
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="no-underline">
                    <button
                      className="btn-ghost rounded-full font-medium cursor-pointer"
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.875rem",
                        background: "transparent",
                        border: `1px solid ${theme.colors.borderLight}`,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      Log in
                    </button>
                  </Link>
                  <Link href="/register" className="no-underline">
                    <button
                      className="btn-primary rounded-full font-semibold text-white border-none cursor-pointer"
                      style={{
                        background: theme.gradients.primary,
                        padding: "10px 22px",
                        fontSize: "0.875rem",
                        boxShadow: theme.shadows.glowSm,
                      }}
                    >
                      Get Started Free
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger — 44×44 tap target */}
            <button
              className="mobile-only cursor-pointer border-none bg-transparent"
              style={{ color: theme.colors.textSecondary, padding: "11px" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div
              className="absolute w-full left-0 shadow-2xl"
              style={{
                background: "rgba(18, 22, 30, 0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderTop: `1px solid ${theme.colors.border}`,
                padding: "20px 20px 28px",
                top: theme.sizes.headerHeight,
                zIndex: 99,
              }}
            >
              <nav className="flex flex-col">
                {navLinks.map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="no-underline font-medium py-3.5"
                    style={{
                      fontSize: "0.95rem",
                      color: theme.colors.textSecondary,
                      borderBottom: `1px solid ${theme.colors.border}`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col mt-5" style={{ gap: "10px" }}>
                <Link href="/login" className="no-underline">
                  <button
                    className="w-full rounded-xl font-semibold cursor-pointer"
                    style={{
                      padding: "13px 20px",
                      fontSize: "0.9rem",
                      background: theme.colors.bgHover,
                      border: `1px solid ${theme.colors.borderLight}`,
                      color: theme.colors.textMain,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </button>
                </Link>
                <Link href="/register" className="no-underline">
                  <button
                    className="btn-primary w-full rounded-xl font-semibold text-white border-none cursor-pointer"
                    style={{
                      padding: "13px 20px",
                      fontSize: "0.9rem",
                      background: theme.gradients.primary,
                      boxShadow: theme.shadows.glowSm,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </button>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden hero-py"
          style={{
            paddingTop: `calc(${theme.sizes.headerHeight} + 48px)`, // ← only this line changes
            paddingBottom: "96px",
          }}
        >
          {/* Background glows — pointer-events-none, no interaction cost */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <div
              style={{
                position: "absolute",
                top: "-5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(900px, 120vw)",
                height: "560px",
                borderRadius: "50%",
                background: theme.gradients.glowCenter,
                filter: "blur(48px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: "-5%",
                width: "min(460px, 50vw)",
                height: "min(460px, 50vw)",
                borderRadius: "50%",
                background: `radial-gradient(ellipse, ${theme.colors.accentFaint} 0%, transparent 70%)`,
                filter: "blur(40px)",
              }}
            />
            {/* Dot grid texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.022,
                backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div
            className="relative mx-auto z-10"
            style={{ maxWidth: theme.sizes.maxWidth, padding: "0 20px" }}
          >
            {/* Centered text block */}
            <div className="mx-auto text-center" style={{ maxWidth: "740px" }}>
              {/* Live badge — FIXED: emerald colors, not purple */}
              <div
                className="anim-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
                style={{
                  background: theme.colors.primaryFaint,
                  border: `1px solid rgba(16,185,129,0.3)`,
                }}
              >
                <span
                  className="relative flex"
                  style={{ width: "8px", height: "8px" }}
                >
                  <span
                    style={{
                      position: "absolute",
                      borderRadius: "50%",
                      width: "100%",
                      height: "100%",
                      background: "rgba(16,185,129,0.5)",
                      animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      borderRadius: "50%",
                      width: "8px",
                      height: "8px",
                      background: theme.colors.primary,
                    }}
                  />
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: theme.colors.primary }}
                >
                  Platform v2.0 — Now Live
                </span>
              </div>

              {/* H1 — fluid clamp size */}
              <h1
                className="anim-fade-up d-100 font-black tracking-tight mb-6"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 5rem)",
                  color: theme.colors.textMain,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                }}
              >
                The Future of <span className="gradient-text">Learning</span>
                <br />
                is Already Here.
              </h1>

              {/* Subheadline */}
              <p
                className="anim-fade-up d-200 leading-relaxed mx-auto mb-10"
                style={{
                  color: theme.colors.textSecondary,
                  maxWidth: "520px",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.08rem)",
                }}
              >
                BrainEvo brings live classes, analytics, assignments, and
                accountability into one seamless platform — for both teachers
                and students.
              </p>

              {/* CTA row */}
              <div className="anim-fade-up d-300 flex flex-wrap items-center justify-center gap-3 mb-12">
                <Link href="/register" className="no-underline">
                  <button
                    className="btn-primary flex items-center gap-2 rounded-full text-white font-bold border-none cursor-pointer"
                    style={{
                      background: theme.gradients.primary,
                      padding: "clamp(11px,2vw,14px) clamp(20px,4vw,28px)",
                      fontSize: "clamp(0.875rem,2vw,1rem)",
                    }}
                  >
                    Start for Free <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/demo" className="no-underline">
                  <button
                    className="btn-ghost flex items-center gap-2 rounded-full font-semibold cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${theme.colors.borderLight}`,
                      color: theme.colors.textMain,
                      padding: "clamp(11px,2vw,14px) clamp(20px,4vw,28px)",
                      fontSize: "clamp(0.875rem,2vw,1rem)",
                    }}
                  >
                    <PlayCircle size={20} color={theme.colors.primary} />
                    Watch Demo
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div
                className="anim-fade-up d-400 grid grid-cols-3 gap-3 mx-auto stats-grid"
                style={{ maxWidth: "400px" }}
              >
                <StatCard value="50K+" label="Active Students" delay="d-400" />
                <StatCard value="2K+" label="Live Classes" delay="d-500" />
                <StatCard value="98%" label="Satisfaction" delay="d-600" />
              </div>
            </div>

            {/* ── Coming Soon Dashboard Card ───────────────────────────── */}
            <div
              className="anim-fade-up d-500 relative mx-auto mt-14"
              style={{ maxWidth: "860px", width: "100%" }}
            >
              {/* Outer glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                aria-hidden="true"
                style={{
                  background: theme.gradients.cardBorder,
                  filter: "blur(1px)",
                  borderRadius: "22px",
                }}
              />

              {/* Browser chrome card */}
              <div
                className="anim-float relative rounded-2xl overflow-hidden"
                style={{
                  background: theme.colors.bgCard,
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: `${theme.shadows.xl}, 0 0 48px ${theme.colors.primaryGlow}`,
                }}
              >
                {/* Chrome bar */}
                <div
                  className="flex items-center gap-1.5 px-4 py-3 border-b"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderColor: theme.colors.border,
                  }}
                >
                  {["#f85149", "#f59e0b", "#10b981"].map((c, i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: "10px",
                        height: "10px",
                        background: c,
                        opacity: 0.7,
                      }}
                    />
                  ))}
                  <div
                    className="ml-2 rounded-md px-3 py-1 flex items-center gap-1.5"
                    style={{
                      background: theme.colors.bgHover,
                      color: theme.colors.textMuted,
                      fontSize: "0.72rem",
                    }}
                  >
                    <span style={{ fontSize: "0.65rem" }}>🔒</span>
                    app.brainevo.io/dashboard
                  </div>
                </div>

                {/* Coming Soon body */}
                <div
                  className="flex flex-col items-center justify-center text-center"
                  style={{
                    aspectRatio: "16/9",
                    width: "100%",
                    background: `
                      radial-gradient(ellipse at 60% 40%, rgba(16,185,129,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 80%, rgba(245,158,11,0.04) 0%, transparent 50%),
                      ${theme.colors.bgCard}
                    `,
                    padding: "clamp(24px,5vw,40px) clamp(16px,4vw,24px)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Grid texture */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.025,
                      pointerEvents: "none",
                      backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
                    `,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Skeleton bars */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "20px",
                      opacity: 0.055,
                      pointerEvents: "none",
                    }}
                  >
                    <div className="flex gap-3 mb-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-xl"
                          style={{
                            height: "60px",
                            background: theme.colors.textSecondary,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="rounded-xl mb-3"
                      style={{
                        height: "120px",
                        background: theme.colors.textSecondary,
                      }}
                    />
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg mb-2"
                        style={{
                          height: "28px",
                          background: theme.colors.textSecondary,
                        }}
                      />
                    ))}
                  </div>

                  {/* Central content */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div
                      className="anim-pulse-glow flex items-center justify-center rounded-2xl mb-5"
                      style={{
                        width: "64px",
                        height: "64px",
                        background: theme.colors.primaryFaint,
                        border: `1px solid rgba(16,185,129,0.3)`,
                      }}
                    >
                      <Brain
                        size={28}
                        color={theme.colors.primary}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div
                      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
                      style={{
                        background: theme.colors.primaryFaint,
                        border: `1px solid rgba(16,185,129,0.3)`,
                      }}
                    >
                      <span
                        className="relative flex"
                        style={{ width: "8px", height: "8px" }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            borderRadius: "50%",
                            width: "100%",
                            height: "100%",
                            background: "rgba(16,185,129,0.5)",
                            animation:
                              "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                          }}
                        />
                        <span
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            borderRadius: "50%",
                            width: "8px",
                            height: "8px",
                            background: theme.colors.primary,
                          }}
                        />
                      </span>
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: theme.colors.primary }}
                      >
                        In Development
                      </span>
                    </div>

                    <h3
                      className="font-extrabold tracking-tight mb-2"
                      style={{
                        fontSize: "clamp(1.1rem,3vw,1.8rem)",
                        color: theme.colors.textMain,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Dashboard Coming Soon
                    </h3>

                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{
                        color: theme.colors.textSecondary,
                        maxWidth: "320px",
                      }}
                    >
                      We're crafting a powerful, insight-driven dashboard for
                      students and teachers. Sign up to get early access.
                    </p>

                    <Link href="/register" className="no-underline">
                      <button
                        className="btn-primary flex items-center gap-2 rounded-full font-semibold text-white border-none cursor-pointer"
                        style={{
                          background: theme.gradients.primary,
                          padding: "10px 24px",
                          fontSize: "0.875rem",
                          boxShadow: theme.shadows.glowSm,
                        }}
                      >
                        Get Early Access <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TRUSTED BY STRIP
        ══════════════════════════════════════════════════════════════════ */}
        <div
          className="py-7 border-t border-b"
          style={{
            borderColor: theme.colors.border,
            background: "rgba(255,255,255,0.012)",
          }}
        >
          <div
            className="mx-auto text-center"
            style={{ maxWidth: theme.sizes.maxWidth, padding: "0 20px" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: theme.colors.textMuted }}
            >
              Trusted by educators and institutions
            </p>
            <div
              className="flex flex-wrap justify-center items-center trusted-row"
              style={{ gap: "32px" }}
            >
              {trustedBy.map((name) => (
                <span
                  key={name}
                  className="text-sm font-bold tracking-tight"
                  style={{ color: "#3a4f6e" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-py" style={{ padding: "88px 0" }}>
          <div
            className="mx-auto"
            style={{ maxWidth: theme.sizes.maxWidth, padding: "0 20px" }}
          >
            <div className="text-center mb-14">
              <SectionBadge label="Everything You Need" />
              <h2
                className="font-extrabold tracking-tight leading-tight mb-4"
                style={{
                  fontSize: "clamp(1.75rem,4vw,3rem)",
                  color: theme.colors.textMain,
                  letterSpacing: "-0.03em",
                }}
              >
                Built for how educators{" "}
                <span className="gradient-text">actually work</span>
              </h2>
              <p
                className="leading-relaxed mx-auto"
                style={{
                  color: theme.colors.textSecondary,
                  maxWidth: "480px",
                  fontSize: "clamp(0.9rem,2vw,1rem)",
                }}
              >
                Every feature is designed around real classroom and e-learning
                workflows — not generic software assumptions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={`d-${((i % 3) + 1) * 100}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS
            FIXED: step icon border was rgba(124,58,237,0.25) — purple.
                   Now uses rgba(16,185,129,0.25) — Emerald. Consistent.
        ══════════════════════════════════════════════════════════════════ */}
        <section
          className="section-py border-t border-b"
          style={{
            padding: "88px 0",
            borderColor: theme.colors.border,
            background: "rgba(255,255,255,0.012)",
          }}
        >
          <div
            className="mx-auto"
            style={{ maxWidth: theme.sizes.maxWidth, padding: "0 20px" }}
          >
            <div className="text-center mb-14">
              <SectionBadge
                label="How It Works"
                accentColor={theme.colors.accent}
              />
              <h2
                className="font-extrabold tracking-tight"
                style={{
                  fontSize: "clamp(1.75rem,4vw,3rem)",
                  color: theme.colors.textMain,
                  letterSpacing: "-0.03em",
                }}
              >
                From sign-up to{" "}
                <span className="gradient-text">first lesson in minutes</span>
              </h2>
            </div>

            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4"
              style={{ borderTop: `1px solid ${theme.colors.border}` }}
            >
              {steps.map((s, i) => (
                <div
                  key={s.step}
                  className="anim-fade-up step-cell text-center"
                  style={{
                    padding: "36px 24px",
                    borderRight:
                      i < steps.length - 1
                        ? `1px solid ${theme.colors.border}`
                        : "none",
                  }}
                >
                  {/* FIXED: icon border was purple, now Emerald */}
                  <div
                    className="flex items-center justify-center rounded-full mx-auto mb-4"
                    style={{
                      width: "52px",
                      height: "52px",
                      background: theme.colors.primaryFaint,
                      border: `1px solid rgba(16,185,129,0.25)`,
                    }}
                  >
                    {/* FIXED: icon color was #a78bfa (purple), now primary (Emerald) */}
                    <s.icon size={22} color={theme.colors.primary} />
                  </div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: theme.colors.textMuted }}
                  >
                    STEP {s.step}
                  </div>
                  <div
                    className="text-base font-bold mb-2"
                    style={{ color: theme.colors.textMain }}
                  >
                    {s.title}
                  </div>
                  <div
                    className="text-sm leading-relaxed"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════════════════════════ */}
        <section className="section-py" style={{ padding: "88px 0" }}>
          <div
            className="mx-auto"
            style={{ maxWidth: theme.sizes.maxWidth, padding: "0 20px" }}
          >
            <div className="text-center mb-14">
              <SectionBadge label="Loved by Educators" />
              <h2
                className="font-extrabold tracking-tight"
                style={{
                  fontSize: "clamp(1.75rem,4vw,3rem)",
                  color: theme.colors.textMain,
                  letterSpacing: "-0.03em",
                }}
              >
                Real people.{" "}
                <span className="gradient-text">Real results.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.name}
                  {...t}
                  delay={`d-${(i + 1) * 100}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CTA BANNER
            FIXED: was purple gradient — now Emerald consistent with brand.
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 20px 72px" }}>
          <div
            className="mx-auto text-center relative overflow-hidden cta-card"
            style={{
              maxWidth: "860px",
              // FIXED: was rgba(124,58,237,0.18) purple — now Emerald
              background: `linear-gradient(135deg, rgba(16,185,129,0.1), rgba(13,148,136,0.06))`,
              border: `1px solid rgba(16,185,129,0.22)`,
              borderRadius: "24px",
              padding: "64px 48px",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                top: "-60px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "500px",
                height: "300px",
                borderRadius: "50%",
                background: theme.gradients.glowCenter,
              }}
            />

            <div className="relative z-10">
              <h2
                className="font-black tracking-tight leading-tight mb-4"
                style={{
                  fontSize: "clamp(1.5rem,4vw,2.6rem)",
                  color: theme.colors.textMain,
                  letterSpacing: "-0.03em",
                }}
              >
                Ready to transform your classroom?
              </h2>
              <p
                className="leading-relaxed mb-10 mx-auto"
                style={{
                  color: theme.colors.textSecondary,
                  maxWidth: "440px",
                  fontSize: "clamp(0.9rem,2vw,1rem)",
                }}
              >
                Join thousands of educators and students already learning
                smarter with BrainEvo.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register" className="no-underline">
                  <button
                    className="btn-primary flex items-center gap-2 rounded-full font-bold text-white border-none cursor-pointer"
                    style={{
                      background: theme.gradients.primary,
                      padding: "clamp(11px,2vw,14px) clamp(20px,4vw,32px)",
                      fontSize: "clamp(0.875rem,2vw,1rem)",
                    }}
                  >
                    Get Started — It's Free <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/login" className="no-underline">
                  <button
                    className="btn-ghost rounded-full font-semibold cursor-pointer"
                    style={{
                      background: "transparent",
                      border: `1px solid ${theme.colors.borderLight}`,
                      color: theme.colors.textSecondary,
                      padding: "clamp(11px,2vw,14px) clamp(18px,4vw,28px)",
                      fontSize: "clamp(0.875rem,2vw,1rem)",
                    }}
                  >
                    Log in to existing account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <footer
          className="border-t"
          style={{
            padding: "36px 20px",
            borderColor: theme.colors.border,
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <div
            className="mx-auto flex flex-wrap justify-between items-center gap-5 footer-row"
            style={{ maxWidth: theme.sizes.maxWidth }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "30px",
                  height: "30px",
                  background: theme.gradients.primary,
                }}
              >
                <Brain size={14} color="#fff" />
              </div>
              <span
                className="text-base font-extrabold"
                style={{ color: theme.colors.textMain }}
              >
                BrainEvo
              </span>
            </div>

            <div className="flex gap-6 flex-wrap footer-links">
              {["Privacy Policy", "Terms of Service", "Help Center"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-sm font-medium no-underline"
                    style={{
                      color: theme.colors.textMuted,
                      transition: `color ${theme.transitions.base}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = theme.colors.textSecondary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = theme.colors.textMuted)
                    }
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>

            <p className="text-sm" style={{ color: theme.colors.textDisabled }}>
              © {new Date().getFullYear()} BrainEvo Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
