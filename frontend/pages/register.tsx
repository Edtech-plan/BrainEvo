// pages/register.tsx
// ─────────────────────────────────────────────────────────────────────────────
// BrainEvo — Register Page v3
// Fix 1: Role selector — selected = Emerald border ONLY, unselected = no border
// Fix 2: Right panel — removed stat cards, restored overlapping floating cards
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
import { useAuth } from "../src/features/auth/hooks/useAuth";
import { getDashboardRoute } from "../src/shared/utils/routing";
import RoleSelector from "../src/features/auth/components/RoleSelector";
import LearnerForm from "../src/features/auth/components/LearnerForm";
import TeacherForm from "../src/features/auth/components/TeacherForm";
import AdminForm from "../src/features/auth/components/AdminForm";
import invitationService from "../src/modules/invitation/invitation.service";
import type { UserRole, RegisterUserData, User } from "../src/shared/types";
import type {
  LearnerFormData,
  TeacherFormData,
  AdminFormData,
  FormErrors,
  InvitationData,
} from "../src/shared/types/forms.types";
import type { AppErrorType } from "../src/shared/types/errors.types";
import { getErrorMessage } from "../src/shared/types/errors.types";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { theme } from "@/styles/theme";

const RegisterStyles = () => (
  <style jsx global>{`
    .register-root::-webkit-scrollbar {
      display: none;
    }
    .register-root {
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
    @keyframes floatA {
      0%,
      100% {
        transform: translateY(0px) rotate(-3deg);
      }
      50% {
        transform: translateY(-8px) rotate(-3deg);
      }
    }
    @keyframes floatB {
      0%,
      100% {
        transform: translateY(0px) rotate(3deg);
      }
      50% {
        transform: translateY(-10px) rotate(3deg);
      }
    }
    @keyframes floatC {
      0%,
      100% {
        transform: translateY(0px) rotate(-2deg);
      }
      50% {
        transform: translateY(-6px) rotate(-2deg);
      }
    }

    .reg-fade-up {
      animation: fadeUp 0.6s ease both;
      will-change: transform, opacity;
    }
    .reg-fade-up.d1 {
      animation-delay: 0.05s;
    }
    .reg-fade-up.d2 {
      animation-delay: 0.12s;
    }
    .reg-fade-up.d3 {
      animation-delay: 0.2s;
    }
    .reg-fade-up.d4 {
      animation-delay: 0.28s;
    }
    .reg-fade-up.d5 {
      animation-delay: 0.36s;
    }

    /* ── Primary button ───────────────────────────────────────────────────── */
    .reg-btn-primary {
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
    .reg-btn-primary::after {
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
    .reg-btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(16, 185, 129, 0.45);
    }
    .reg-btn-primary:hover:not(:disabled)::after {
      opacity: 1;
    }
    .reg-btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }
    .reg-btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* ── Role Selector overrides ──────────────────────────────────────────── */

    /* All role cards base — CHANGED: border visible by default */
    .reg-role-wrap button,
    .reg-role-wrap [role="button"],
    .reg-role-wrap > div > div {
      background: ${theme.colors.bgCard} !important;
      border: 1px solid ${theme.colors.borderLight} !important; /* ← WAS: transparent */
      color: ${theme.colors.textSecondary} !important;
      transition: border-color 200ms ease !important;
      border-radius: 12px !important;
    }

    /* Hover — CHANGED: border disappears on hover */
    .reg-role-wrap button:hover,
    .reg-role-wrap [role="button"]:hover {
      border-color: transparent !important; /* ← WAS: borderLight */
      background: ${theme.colors.bgCard} !important;
    }

    /* Selected state — Emerald border, nothing else changes */
    .reg-role-wrap [class*="border-blue"],
    .reg-role-wrap [class*="ring-blue"],
    .reg-role-wrap [data-selected="true"],
    .reg-role-wrap [aria-selected="true"],
    .reg-role-wrap .selected,
    .reg-role-wrap [class*="selected"] {
      border-color: ${theme.colors.primary} !important;
      box-shadow: none !important;
      background: ${theme.colors.bgCard} !important;
    }

    /* Kill ALL blue color classes inside role wrap */
    .reg-role-wrap [class*="text-blue"] {
      color: ${theme.colors.textSecondary} !important;
    }
    .reg-role-wrap [class*="bg-blue"] {
      background: transparent !important;
    }

    /* Section label */
    .reg-role-wrap label,
    .reg-role-wrap p,
    .reg-role-wrap span,
    .reg-role-wrap h3,
    .reg-role-wrap h4 {
      color: ${theme.colors.textSecondary} !important;
    }

    /* ── Form inputs ─────────────────────────────────────────────────────── */
    .reg-form-area input,
    .reg-form-area textarea,
    .reg-form-area select {
      background: ${theme.colors.bgInput} !important;
      border: 1px solid ${theme.colors.border} !important;
      color: ${theme.colors.textMain} !important;
      border-radius: 10px !important;
      font-family: ${theme.font.sans} !important;
      font-size: 0.875rem !important;
      padding: 11px 14px !important;
      outline: none !important;
      transition:
        border-color 250ms ease,
        box-shadow 250ms ease !important;
      width: 100% !important;
    }
    .reg-form-area input:focus,
    .reg-form-area textarea:focus {
      border-color: ${theme.colors.borderFocus} !important;
      box-shadow: ${theme.shadows.input} !important;
    }
    .reg-form-area input::placeholder,
    .reg-form-area textarea::placeholder {
      color: ${theme.colors.textMuted} !important;
    }
    .reg-form-area label {
      color: ${theme.colors.textSecondary} !important;
      font-size: 0.8rem !important;
      font-weight: 500 !important;
      margin-bottom: 5px !important;
      display: block !important;
    }
    .reg-form-area [class*="error"] {
      color: ${theme.colors.errorText} !important;
      font-size: 0.75rem !important;
      margin-top: 4px !important;
    }

    /* ── Floating cards ──────────────────────────────────────────────────── */
    .float-card-a {
      animation: floatA 6s ease-in-out infinite;
      will-change: transform;
      transition:
        box-shadow 300ms ease,
        border-color 300ms ease;
    }
    .float-card-b {
      animation: floatB 7s ease-in-out infinite;
      will-change: transform;
      transition:
        box-shadow 300ms ease,
        border-color 300ms ease;
    }
    .float-card-c {
      animation: floatC 5s ease-in-out infinite;
      will-change: transform;
      transition:
        box-shadow 300ms ease,
        border-color 300ms ease;
    }
    .float-card-a:hover,
    .float-card-b:hover,
    .float-card-c:hover {
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.6),
        0 0 24px rgba(16, 185, 129, 0.2) !important;
      border-color: rgba(16, 185, 129, 0.35) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .reg-fade-up,
      .float-card-a,
      .float-card-b,
      .float-card-c {
        animation: none !important;
        transition: none !important;
      }
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Register: NextPage = () => {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading, user } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [showForm, setShowForm] = useState(false);
  const [inviteData, setInviteData] = useState<InvitationData | null>(null);
  const [isVerifyingInvite, setIsVerifyingInvite] = useState(false);
  const [learnerData, setLearnerData] = useState<LearnerFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [teacherData, setTeacherData] = useState<TeacherFormData>({
    name: "",
    email: "",
    password: "",
    qualifications: "",
    subjectsTaught: "",
  });
  const [adminData, setAdminData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
    organizationName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const selectedRoleRef = useRef(selectedRole);
  const inviteDataRef = useRef(inviteData);
  useEffect(() => {
    selectedRoleRef.current = selectedRole;
    inviteDataRef.current = inviteData;
  }, [selectedRole, inviteData]);

  useEffect(() => {
    const verifyInviteToken = async () => {
      const { token } = router.query;
      if (token && typeof token === "string") {
        setIsVerifyingInvite(true);
        try {
          const response = await invitationService.verifyInvitation(token);
          if (response.success && response.invitation) {
            const orgId =
              typeof response.invitation.organizationId === "string"
                ? { id: response.invitation.organizationId, name: "" }
                : {
                    id: response.invitation.organizationId.id,
                    name: response.invitation.organizationId.name || "",
                  };
            setInviteData({
              id: response.invitation.id,
              organizationId: orgId,
              email: response.invitation.email,
              role: response.invitation.role,
              token: response.invitation.token,
              expiresAt: response.invitation.expiresAt,
              isUsed: response.invitation.isUsed,
            });
            setSelectedRole(response.invitation.role);
            setShowForm(true);
            if (response.invitation.email) {
              if (response.invitation.role === "learner")
                setLearnerData((prev) => ({
                  ...prev,
                  email: response.invitation.email,
                }));
              else if (response.invitation.role === "teacher")
                setTeacherData((prev) => ({
                  ...prev,
                  email: response.invitation.email,
                }));
            }
          } else {
            setErrorMessage("Invalid or expired invitation link.");
          }
        } catch (error: unknown) {
          const appError = error as AppErrorType;
          setErrorMessage(
            getErrorMessage(appError) || "Invalid invitation link.",
          );
        } finally {
          setIsVerifyingInvite(false);
        }
      }
    };
    if (router.isReady) verifyInviteToken();
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user)
      router.push(getDashboardRoute(user.role));
  }, [isAuthenticated, authLoading, user, router]);

  const handleRoleChange = (role: UserRole) => {
    if (!inviteData && role === "organization_admin") {
      setSelectedRole("");
      setErrors({});
      setErrorMessage(
        "Admin accounts are created by the BrainEvo team. Please contact brainevo.helpdesk@gmail.com",
      );
      return;
    }
    setSelectedRole(role);
    setErrors({});
    setErrorMessage("");
    if (inviteData) setShowForm(true);
  };

  const handleLearnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLearnerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };
  const handleTeacherChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTeacherData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!selectedRole) {
      setErrorMessage("Please select a role.");
      return false;
    }
    if (selectedRole === "learner") {
      if (!learnerData.name.trim()) newErrors.name = "Name is required";
      if (!learnerData.email || !/\S+@\S+\.\S+/.test(learnerData.email))
        newErrors.email = "Valid email required";
      if (!learnerData.password || learnerData.password.length < 6)
        newErrors.password = "Min 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;
    setIsLoading(true);
    try {
      let registerData: RegisterUserData;
      if (selectedRole === "learner") {
        registerData = {
          ...learnerData,
          role: "learner",
          inviteToken: inviteData?.token,
        };
      } else if (selectedRole === "teacher") {
        registerData = {
          ...teacherData,
          role: "teacher",
          subjectsTaught: teacherData.subjectsTaught?.split(","),
          inviteToken: inviteData?.token,
        };
      } else {
        registerData = { ...adminData, role: "organization_admin" };
      }
      const createdUser: User = await register(registerData);
      router.push(getDashboardRoute(createdUser.role));
    } catch (error: unknown) {
      const appError = error as AppErrorType;
      setErrorMessage(
        getErrorMessage(appError) || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isVerifyingInvite) {
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

  return (
    <>
      <RegisterStyles />
      <div
        className="register-root min-h-screen flex"
        style={{ background: theme.colors.bgMain, fontFamily: theme.font.sans }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            LEFT PANEL — Form (unchanged from v2)
        ══════════════════════════════════════════════════════════════════ */}
        <main
          className="w-full lg:w-1/2 flex flex-col justify-center relative"
          style={{
            padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 56px)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "20%",
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
              maxWidth: "440px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Back */}
            <Link
              href="/"
              className="reg-fade-up d1 inline-flex items-center no-underline"
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
              className="reg-fade-up d1 flex items-center"
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
            <div className="reg-fade-up d2" style={{ marginBottom: "28px" }}>
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
                Create your account
              </h1>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {inviteData
                  ? `You've been invited as ${inviteData.role}. Complete your profile below.`
                  : "Join BrainEvo — built for teachers and students who take learning seriously."}
              </p>
            </div>

            {/* Invite banner */}
            {inviteData && (
              <div
                className="reg-fade-up d2 flex items-start gap-3"
                style={{
                  background: theme.colors.successBg,
                  border: `1px solid ${theme.colors.successBorder}`,
                  borderRadius: theme.borderRadius.md,
                  padding: "12px 14px",
                  marginBottom: "20px",
                }}
              >
                <CheckCircle2
                  size={16}
                  color={theme.colors.success}
                  style={{ marginTop: "1px", flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{
                      color: theme.colors.successText,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: "2px",
                    }}
                  >
                    Invitation verified
                  </p>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: "0.75rem",
                    }}
                  >
                    {inviteData.organizationId?.name
                      ? `Joining ${inviteData.organizationId.name} as ${inviteData.role}`
                      : `Registered as ${inviteData.role}`}
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {errorMessage && (
              <div
                className="reg-fade-up flex items-start gap-3"
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

            {/* Role selector — FIX 1 wrapper */}
            <div
              className="reg-fade-up d3 reg-role-wrap"
              style={{ marginBottom: "16px" }}
            >
              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
                disabled={!!inviteData}
              />
            </div>

            {/* Continue */}
            {selectedRole && !showForm && (
              <div className="reg-fade-up d4">
                <button
                  type="button"
                  className="reg-btn-primary w-full flex items-center justify-center gap-2"
                  onClick={() => setShowForm(true)}
                  style={{
                    background: theme.gradients.primary,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    padding: "13px 20px",
                    borderRadius: theme.borderRadius.md,
                    width: "100%",
                    boxShadow: theme.shadows.glowSm,
                    letterSpacing: "0.01em",
                  }}
                >
                  Continue to Registration <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Form */}
            {selectedRole && showForm && (
              <form
                onSubmit={handleSubmit}
                className="reg-fade-up d4 reg-form-area"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {selectedRole === "learner" && (
                  <LearnerForm
                    formData={learnerData}
                    errors={errors}
                    onChange={handleLearnerChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}
                {selectedRole === "teacher" && (
                  <TeacherForm
                    formData={teacherData}
                    errors={errors}
                    onChange={handleTeacherChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}
                {selectedRole === "organization_admin" && (
                  <AdminForm
                    formData={adminData}
                    errors={errors}
                    onChange={handleAdminChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}

                <button
                  type="submit"
                  className="reg-btn-primary w-full flex items-center justify-center gap-2"
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
                    marginTop: "4px",
                    boxShadow: isLoading ? "none" : theme.shadows.glowSm,
                    letterSpacing: "0.01em",
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
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Sign in */}
            <p
              className="reg-fade-up d5"
              style={{
                marginTop: "24px",
                textAlign: "center",
                fontSize: "0.82rem",
                color: theme.colors.textMuted,
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
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
                Sign in
              </Link>
            </p>

            {/* Trust row */}
            <div
              className="reg-fade-up d5"
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
              {["No credit card", "Free forever plan", "Cancel anytime"].map(
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
            RIGHT PANEL — Visual
            FIX 2: Stat cards REMOVED. Overlapping absolute floating cards
                   restored from v1. Each card has its own float animation
                   at different speeds so they feel alive independently.
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
            {/* Live badge */}
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
                Now Accepting Signups
              </span>
            </div>

            {/* Headline */}
            <h2
              style={{
                color: theme.colors.textMain,
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "10px",
              }}
            >
              Start Building Your{" "}
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
                Future
              </span>
            </h2>
            <p
              style={{
                color: theme.colors.textSecondary,
                fontSize: "0.9rem",
                lineHeight: 1.65,
                marginBottom: "44px",
                maxWidth: "340px",
              }}
            >
              Live classes, smart analytics, and real accountability — all in
              one place.
            </p>

            {/* ── FIX 2: Overlapping floating cards — NO stat cards below ──
                3 cards with absolute positioning.
                Carefully tuned top/left/right so they overlap naturally
                without any card being fully hidden.
                Each uses a different float animation class for variation.   */}
            <div
              style={{ position: "relative", height: "320px", width: "100%" }}
            >
              {/* Card 1 — For Learners — top-left, tilted left */}
              <div
                className="float-card-a"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "230px",
                  background: theme.colors.bgCard,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  padding: "20px",
                  boxShadow: theme.shadows.lg,
                  transform: "rotate(-3deg)",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(135deg, ${theme.colors.primary}, #0d9488)`,
                    borderRadius: theme.borderRadius.md,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
                  }}
                >
                  <GraduationCap size={20} color="#fff" />
                </div>
                <h3
                  style={{
                    color: theme.colors.textMain,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  For Learners
                </h3>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Personalised learning paths and real-time progress tracking.
                </p>
              </div>

              {/* Card 2 — For Teachers — top-right, tilted right, offset down */}
              <div
                className="float-card-b"
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  width: "230px",
                  background: theme.colors.bgCard,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  padding: "20px",
                  boxShadow: theme.shadows.lg,
                  transform: "rotate(3deg)",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(135deg, ${theme.colors.accent}, #d97706)`,
                    borderRadius: theme.borderRadius.md,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.25)",
                  }}
                >
                  <BookOpen size={20} color="#fff" />
                </div>
                <h3
                  style={{
                    color: theme.colors.textMain,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  For Teachers
                </h3>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  Smart assignments, batch management and deep analytics.
                </p>
              </div>

              {/* Card 3 — Enterprise — bottom-left, slight overlap with card 1 */}
              <div
                className="float-card-c"
                style={{
                  position: "absolute",
                  top: "185px",
                  left: "30px",
                  width: "230px",
                  background: theme.colors.bgCard,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  padding: "20px",
                  boxShadow: theme.shadows.lg,
                  transform: "rotate(-2deg)",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #2dd4bf, #0d9488)",
                    borderRadius: theme.borderRadius.md,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                    boxShadow: "0 4px 12px rgba(45,212,191,0.25)",
                  }}
                >
                  <ShieldCheck size={20} color="#fff" />
                </div>
                <h3
                  style={{
                    color: theme.colors.textMain,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    marginBottom: "6px",
                  }}
                >
                  Enterprise Ready
                </h3>
                <p
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  GDPR-compliant, role-based access and encrypted pipelines.
                </p>
              </div>
            </div>
            {/* ── END floating cards — no stat cards below ─────────────── */}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Register;
