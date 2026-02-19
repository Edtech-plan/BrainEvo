// pages/login.tsx
// ─────────────────────────────────────────────────────────────────────────────
// BrainEvo — Login Page
// Design: Matches register page exactly — dark graphite + Emerald + Amber.
// Layout: Two-column split — Left: form, Right: testimonial/feature panel
// All original logic preserved untouched.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
import { useAuth } from "../src/features/auth/hooks/useAuth";
import { getDashboardRoute } from "../src/shared/utils/routing";
import { useAppContext } from "../src/shared/context/AppContext";
import type { AppErrorType } from "../src/shared/types/errors.types";
import { getErrorMessage } from "../src/shared/types/errors.types";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Star,
  GraduationCap,
  Building2,
  Compass,
  ShieldCheck,
  BarChart3,
  Wifi,
} from "lucide-react";
import { theme } from "@/styles/theme";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE-SCOPED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const LoginStyles = () => (
  <style jsx global>{`
    .login-root::-webkit-scrollbar {
      display: none;
    }
    .login-root {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
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
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes ping {
      75%,
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    .login-fade-up {
      animation: fadeUp 0.6s ease both;
      will-change: transform, opacity;
    }
    .login-fade-up.d1 {
      animation-delay: 0.05s;
    }
    .login-fade-up.d2 {
      animation-delay: 0.12s;
    }
    .login-fade-up.d3 {
      animation-delay: 0.2s;
    }
    .login-fade-up.d4 {
      animation-delay: 0.28s;
    }
    .login-fade-up.d5 {
      animation-delay: 0.36s;
    }
    .login-fade-up.d6 {
      animation-delay: 0.44s;
    }

    /* ── Primary button ───────────────────────────────────────────────────── */
    .login-btn-primary {
      position: relative;
      overflow: hidden;
      transition:
        transform 250ms ease,
        box-shadow 250ms ease;
      will-change: transform;
      cursor: pointer;
      border: none;
      font-family: ${theme.font.sans};
    }
    .login-btn-primary::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.12),
        transparent
      );
      opacity: 0;
      transition: opacity 250ms ease;
    }
    .login-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(16, 185, 129, 0.45);
    }
    .login-btn-primary:hover:not(:disabled)::after {
      opacity: 1;
    }
    .login-btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }
    .login-btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* ── Input focus ─────────────────────────────────────────────────────── */
    .login-input {
      background: ${theme.colors.bgInput};
      border: 1px solid ${theme.colors.border};
      color: ${theme.colors.textMain};
      border-radius: 10px;
      font-family: ${theme.font.sans};
      font-size: 0.875rem;
      padding: 11px 14px;
      outline: none;
      transition:
        border-color 250ms ease,
        box-shadow 250ms ease;
      width: 100%;
    }
    .login-input:focus {
      border-color: ${theme.colors.borderFocus};
      box-shadow: ${theme.shadows.input};
    }
    .login-input::placeholder {
      color: ${theme.colors.textMuted};
    }
    .login-input.error {
      border-color: ${theme.colors.error};
    }

    /* ── Password input wrapper ──────────────────────────────────────────── */
    .login-input-pass {
      padding-right: 44px;
    }

    /* ── Right panel feature item hover ─────────────────────────────────── */
    .login-feature-item {
      transition:
        background 200ms ease,
        border-color 200ms ease;
    }
    .login-feature-item:hover {
      background: rgba(16, 185, 129, 0.04) !important;
      border-color: rgba(16, 185, 129, 0.2) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .login-fade-up {
        animation: none !important;
      }
      .login-btn-primary {
        transition: none !important;
      }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Login: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Auth redirect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, authLoading, user, router]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage("");
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;
    setIsLoading(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      router.push(getDashboardRoute(loggedInUser.role));
    } catch (error: AppErrorType) {
      setErrorMessage(
        getErrorMessage(error) || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.colors.bgMain }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            border: `3px solid ${theme.colors.primaryFaint}`,
            borderTopColor: theme.colors.primary,
            borderRadius: "50%",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <LoginStyles />

      <div
        className="login-root min-h-screen flex"
        style={{ background: theme.colors.bgMain, fontFamily: theme.font.sans }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            LEFT PANEL — Form
        ══════════════════════════════════════════════════════════════════ */}
        <main
          className="w-full lg:w-1/2 flex flex-col justify-center relative"
          style={{
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 56px)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "25%",
              left: "-60px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "420px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Back link */}
            <Link
              href="/"
              className="login-fade-up d1 inline-flex items-center no-underline"
              style={{
                color: theme.colors.textMuted,
                fontSize: "0.8rem",
                fontWeight: 500,
                gap: "6px",
                marginBottom: "32px",
                transition: `color ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = theme.colors.textSecondary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = theme.colors.textMuted)
              }
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Logo */}
            <div
              className="login-fade-up d1 flex items-center"
              style={{ gap: "10px", marginBottom: "28px" }}
            >
              <div
                className="flex items-center justify-center rounded-xl"
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
                style={{
                  color: theme.colors.textMain,
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                BrainEvo
              </span>
            </div>

            {/* Heading */}
            <div className="login-fade-up d2" style={{ marginBottom: "28px" }}>
              <h1
                style={{
                  color: theme.colors.textMain,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: "8px",
                }}
              >
                Welcome back
              </h1>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                Sign in to continue your learning journey.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div
                className="login-fade-up flex items-start gap-3"
                style={{
                  background: theme.colors.errorBg,
                  border: `1px solid ${theme.colors.errorBorder}`,
                  borderRadius: theme.borderRadius.md,
                  padding: "12px 14px",
                  marginBottom: "20px",
                }}
              >
                <AlertCircle
                  size={16}
                  color={theme.colors.error}
                  style={{ marginTop: "1px", flexShrink: 0 }}
                />
                <p
                  style={{
                    color: theme.colors.errorText,
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              method="POST"
              className="login-fade-up d3"
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              {/* Email */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label
                  htmlFor="email"
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`login-input${errors.email ? " error" : ""}`}
                />
                {errors.email && (
                  <span
                    style={{
                      color: theme.colors.errorText,
                      fontSize: "0.75rem",
                    }}
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="no-underline"
                    style={{
                      color: theme.colors.primary,
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      transition: `color ${theme.transitions.fast}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = theme.colors.primaryDark)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = theme.colors.primary)
                    }
                  >
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={`login-input login-input-pass${errors.password ? " error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: theme.colors.textMuted,
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                      transition: `color ${theme.transitions.fast}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = theme.colors.textSecondary)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = theme.colors.textMuted)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <span
                    style={{
                      color: theme.colors.errorText,
                      fontSize: "0.75rem",
                    }}
                  >
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-btn-primary w-full flex items-center justify-center gap-2"
                disabled={isLoading}
                style={{
                  background: isLoading
                    ? theme.colors.bgHover
                    : theme.gradients.primary,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  padding: "13px 20px",
                  borderRadius: theme.borderRadius.md,
                  width: "100%",
                  boxShadow: isLoading ? "none" : theme.shadows.glowSm,
                  letterSpacing: "0.01em",
                  marginTop: "4px",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.75s linear infinite",
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p
              className="login-fade-up d4"
              style={{
                marginTop: "24px",
                textAlign: "center",
                fontSize: "0.82rem",
                color: theme.colors.textMuted,
              }}
            >
              Don't have an account?{" "}
              <Link
                href="/register"
                className="no-underline"
                style={{
                  color: theme.colors.primary,
                  fontWeight: 600,
                  transition: `color ${theme.transitions.fast}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = theme.colors.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = theme.colors.primary)
                }
              >
                Get started free
              </Link>
            </p>

            {/* Trust row */}
            <div
              className="login-fade-up d5"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              {["256-bit SSL", "GDPR compliant", "SOC 2 certified"].map(
                (text) => (
                  <div
                    key={text}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <CheckCircle2 size={12} color={theme.colors.primary} />
                    <span
                      style={{
                        color: theme.colors.textMuted,
                        fontSize: "0.72rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {text}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </main>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT PANEL — Testimonial + Features
        ══════════════════════════════════════════════════════════════════ */}
        <aside
          className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: theme.colors.bgSurface,
            borderLeft: `1px solid ${theme.colors.border}`,
            minHeight: "100vh",
            padding: "48px 40px",
          }}
        >
          {/* Ambient glows */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-8%",
              right: "-8%",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 65%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-8%",
              left: "-5%",
              width: "380px",
              height: "380px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          {/* Dot grid */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.02,
              pointerEvents: "none",
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "420px",
              width: "100%",
            }}
          >
            {/* Trusted badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: theme.colors.primaryFaint,
                border: `1px solid rgba(16,185,129,0.3)`,
                borderRadius: theme.borderRadius.full,
                padding: "6px 14px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  width: "8px",
                  height: "8px",
                }}
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
                style={{
                  color: theme.colors.primary,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Trusted by Top Institutes
              </span>
            </div>

            {/* Headline */}
            <h2
              style={{
                color: theme.colors.textMain,
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              Elevate your learning with{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #10b981, #2dd4bf, #f59e0b, #10b981)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                intelligent insights
              </span>
            </h2>
            <p
              style={{
                color: theme.colors.textSecondary,
                fontSize: "0.9rem",
                lineHeight: 1.65,
                marginBottom: "28px",
              }}
            >
              Enterprise-grade tools for modern educators and ambitious
              learners.
            </p>

            {/* Feature list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Secure & Reliable Platform",
                  desc: "Enterprise-grade security for your academic data.",
                  color: theme.colors.primary,
                  glow: "rgba(16,185,129,0.2)",
                },
                {
                  icon: BarChart3,
                  title: "Real-time Student Analytics",
                  desc: "Track progress with AI-driven behavioral patterns.",
                  color: theme.colors.accent,
                  glow: "rgba(245,158,11,0.2)",
                },
                {
                  icon: Wifi,
                  title: "Interactive Live Classes",
                  desc: "Engage students globally with low-latency streaming.",
                  color: "#2dd4bf",
                  glow: "rgba(45,212,191,0.2)",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="login-feature-item"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    background: theme.colors.bgCard,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      background: `linear-gradient(135deg, ${f.color}22, ${f.color}11)`,
                      border: `1px solid ${f.color}33`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <f.icon size={17} color={f.color} />
                  </div>
                  <div>
                    <h4
                      style={{
                        color: theme.colors.textMain,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        marginBottom: "3px",
                      }}
                    >
                      {f.title}
                    </h4>
                    <p
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: "0.77rem",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: theme.colors.border,
                marginBottom: "24px",
              }}
            />

            {/* Testimonial */}
            <div style={{ marginBottom: "28px" }}>
              {/* Stars */}
              <div
                style={{ display: "flex", gap: "3px", marginBottom: "10px" }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    style={{
                      fill: theme.colors.accent,
                      color: theme.colors.accent,
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  marginBottom: "16px",
                }}
              >
                "BrainEvo has completely transformed how we deliver curriculum.
                The analytics tools are unmatched in the current market."
              </p>
              {/* Author */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={{ display: "flex" }}>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: `2px solid ${theme.colors.bgSurface}`,
                        background:
                          i === 2
                            ? theme.colors.primaryFaint
                            : theme.colors.bgCard,
                        marginLeft: i > 0 ? "-8px" : "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: theme.colors.primary,
                      }}
                    >
                      {i === 2 ? "+12k" : ""}
                    </div>
                  ))}
                </div>
                <div>
                  <div
                    style={{
                      color: theme.colors.textMain,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                    }}
                  >
                    Dr. Sarah Jenkins
                  </div>
                  <div
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: "0.72rem",
                    }}
                  >
                    Director, Oxford Education Group
                  </div>
                </div>
              </div>
            </div>

            {/* Partner logos */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "28px",
                opacity: 0.35,
              }}
            >
              {[
                { icon: GraduationCap, label: "Academic" },
                { icon: Building2, label: "Institute" },
                { icon: Compass, label: "DesignLab" },
              ].map((p) => (
                <div
                  key={p.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: theme.colors.textSecondary,
                  }}
                >
                  <p.icon size={18} />
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Login;
