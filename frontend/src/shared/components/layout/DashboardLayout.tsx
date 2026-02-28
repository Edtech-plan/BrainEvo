import React, { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Menu,
  X,
  Settings,
  LogOut,
  Brain,
  ChevronDown,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { theme } from "../../../../styles/theme";
import ConfirmationModal from "../ui/ConfirmationModal";
// FIX: useProfileAvatar — subscribes to service, auto-updates on any avatar change
import { useProfileAvatar } from "@/features/student/settings";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: Array<{ id: string; label: string; icon: ReactNode }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function DashboardLayout({
  children,
  navItems,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // FIX: lightweight display hook — subscribes to settingsService
  // so navbar avatar + name update INSTANTLY when changed in ProfileSection
  const {
    avatarUrl,
    fullName,
    email,
    loading: profileLoading,
  } = useProfileAvatar();
  const { logout } = useAuth();

  const getInitials = (name: string): string =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      )
        setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    router.push("/login");
  };

  // Shared avatar renderer — used in both navbar button and dropdown user-info row
  const renderAvatar = (size: number, fontSize: string) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${theme.colors.primary}, #2dd4bf)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 700,
        color: "#fff",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: theme.shadows.glowSm,
      }}
    >
      {/* Show real photo as soon as avatarUrl is available */}
      {!profileLoading && avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={fullName || "Profile"}
          width={size}
          height={size}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          unoptimized
        />
      ) : (
        <span>{getInitials(fullName)}</span>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn  { from { transform:translateX(-100%); } to { transform:translateX(0); } }

        .dl-hide-scroll  { scrollbar-width:none; -ms-overflow-style:none; }
        .dl-hide-scroll::-webkit-scrollbar { display:none; }

        .dl-mobile  { display:flex !important; }
        .dl-desktop { display:none !important; }
        .dl-sidebar { display:none !important; }

        @media (min-width:1024px) {
          .dl-mobile  { display:none  !important; }
          .dl-desktop { display:flex  !important; }
          .dl-sidebar { display:block !important; }
        }

        .dl-icon-btn { transition: background ${theme.transitions.fast}, color ${theme.transitions.fast}; }
        .dl-icon-btn:hover { background: ${theme.colors.bgHover} !important; color: ${theme.colors.textMain} !important; }

        .dl-menu-link:hover   { background: ${theme.colors.bgHover} !important; }
        .dl-menu-danger:hover { background: ${theme.colors.errorBg} !important; color: ${theme.colors.errorText} !important; }

        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .dl-notif-dot { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        isDangerous
      />

      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: theme.colors.bgMain,
          fontFamily: theme.font.sans,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ══ HEADER ══════════════════════════════════════════════════ */}
        <header
          style={{
            height: theme.sizes.headerHeight,
            background: theme.colors.bgSurface,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
            zIndex: theme.zIndex.header,
            boxShadow: "0 1px 0 #21293a, 0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className="dl-mobile dl-icon-btn"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                padding: "8px",
                borderRadius: theme.borderRadius.md,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.colors.textSecondary,
                alignItems: "center",
              }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <button
              className="dl-desktop dl-icon-btn"
              onClick={() => setSidebarCollapsed((p) => !p)}
              style={{
                padding: "8px",
                borderRadius: theme.borderRadius.md,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.colors.textSecondary,
                alignItems: "center",
              }}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeftOpen size={18} />
              )}
            </button>

            <Link
              href="/student/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                marginLeft: "2px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9px",
                  background: theme.gradients.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: theme.shadows.glowSm,
                  flexShrink: 0,
                }}
              >
                <Brain size={17} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  background: `linear-gradient(90deg, ${theme.colors.primary}, #2dd4bf)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BrainEvo
              </span>
            </Link>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              className="dl-icon-btn"
              style={{
                position: "relative",
                padding: "8px",
                borderRadius: theme.borderRadius.md,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: theme.colors.textSecondary,
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span
                className="dl-notif-dot"
                style={{
                  position: "absolute",
                  top: "9px",
                  right: "9px",
                  width: "6px",
                  height: "6px",
                  background: theme.colors.error,
                  borderRadius: "50%",
                  border: `2px solid ${theme.colors.bgSurface}`,
                }}
              />
            </button>

            <div
              style={{
                width: "1px",
                height: "20px",
                background: theme.colors.border,
                margin: "0 6px",
              }}
            />

            {/* Profile trigger */}
            <div ref={profileMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 8px 5px 5px",
                  borderRadius: theme.borderRadius.md,
                  background: profileMenuOpen
                    ? theme.colors.bgHover
                    : "transparent",
                  border: `1px solid ${profileMenuOpen ? theme.colors.borderLight : "transparent"}`,
                  cursor: "pointer",
                  transition: `all ${theme.transitions.fast}`,
                }}
              >
                {/* Avatar — updates immediately when photo is changed in settings */}
                {renderAvatar(28, "11px")}

                <span
                  className="dl-desktop"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.colors.textMain,
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {profileLoading ? "···" : fullName.split(" ")[0] || "Account"}
                </span>
                <ChevronDown
                  size={14}
                  color={theme.colors.textMuted}
                  className="dl-desktop"
                  style={{
                    transition: `transform ${theme.transitions.fast}`,
                    transform: profileMenuOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Dropdown */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "42px",
                    right: 0,
                    width: "220px",
                    background: theme.colors.bgCard,
                    border: `1px solid ${theme.colors.borderLight}`,
                    borderRadius: theme.borderRadius.md,
                    boxShadow: theme.shadows.xl,
                    overflow: "hidden",
                    animation: "fadeDown 0.15s ease",
                    zIndex: theme.zIndex.dropdown,
                  }}
                >
                  {/* User info */}
                  <div
                    style={{
                      padding: "12px 14px",
                      borderBottom: `1px solid ${theme.colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {renderAvatar(36, "13px")}
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: theme.colors.textMain,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fullName || "User"}
                      </div>
                      {/* email comes from useProfileAvatar as a top-level field */}
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.colors.textMuted,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email || "student"}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "4px" }}>
                    <Link
                      href="/student/settings"
                      className="dl-menu-link"
                      onClick={() => setProfileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        color: theme.colors.textMain,
                        fontSize: "13px",
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: `background ${theme.transitions.fast}`,
                      }}
                    >
                      <Settings size={14} color={theme.colors.textSecondary} />{" "}
                      Settings
                    </Link>

                    <div
                      style={{
                        height: "1px",
                        background: theme.colors.border,
                        margin: "4px 0",
                      }}
                    />

                    <button
                      className="dl-menu-danger"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        color: theme.colors.errorText,
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: `all ${theme.transitions.fast}`,
                        fontFamily: theme.font.sans,
                      }}
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ══ BODY ════════════════════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            flex: 1,
            height: `calc(100vh - ${theme.sizes.headerHeight})`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Desktop sidebar */}
          <div className="dl-sidebar" style={{ height: "100%", flexShrink: 0 }}>
            <Sidebar
              navItems={navItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              collapsed={sidebarCollapsed}
            />
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div
              className="dl-mobile"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: theme.zIndex.modal,
                flexDirection: "column",
              }}
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: theme.colors.bgOverlay,
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Close menu"
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "272px",
                  background: theme.colors.bgSurface,
                  display: "flex",
                  flexDirection: "column",
                  animation: "slideIn 0.25s ease",
                  borderRight: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: theme.gradients.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Brain size={14} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: theme.colors.textMain,
                      }}
                    >
                      BrainEvo
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: "6px",
                      borderRadius: theme.borderRadius.md,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: theme.colors.textSecondary,
                      display: "flex",
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div
                  style={{ flex: 1, overflowY: "auto" }}
                  className="dl-hide-scroll"
                >
                  <Sidebar
                    navItems={navItems}
                    activeSection={activeSection}
                    onSectionChange={(id) => {
                      onSectionChange(id);
                      setMobileMenuOpen(false);
                    }}
                    collapsed={false}
                    isMobile
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main */}
          <main
            className="dl-hide-scroll"
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
              padding: theme.sizes.contentPadding,
              background: theme.colors.bgMain,
            }}
          >
            <div style={{ maxWidth: theme.sizes.maxWidth, margin: "0 auto" }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
