import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Calendar as CalendarIcon,
  Video,
} from "lucide-react";
import { useStudentRoute } from "../../../src/shared/hooks";
import { DashboardLayout } from "../../../src/shared/components/layout";
import { theme } from "../../../styles/theme";
import {
  OngoingClass,
  TodayClasses,
  UpcomingClasses,
  PastClasses,
} from "@/features/student/live-classes";

export default function LiveClasses() {
  const router = useRouter();
  const { isAuthenticated, loading } = useStudentRoute();
  const [activeSection] = useState("live-classes");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  const handleNavigation = (section: string) => {
    const routes: Record<string, string> = {
      calendar: "/student/calendar",
      overview: "/student/dashboard",
      projects: "/student/assignment",
      settings: "/student/settings",
    };
    if (section === "live-classes") return;
    if (routes[section]) {
      router.push(routes[section]);
      return;
    }
    router.push(`/student/dashboard?section=${section}`);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "live-classes", label: "Live Classes", icon: <Video size={20} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarIcon size={20} /> },
    { id: "projects", label: "Assignments", icon: <FolderKanban size={20} /> },
    { id: "resources", label: "Resources", icon: <Library size={20} /> },
    { id: "messages", label: "Messages", icon: <Bell size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          backgroundColor: theme.colors.bgMain,
          fontFamily: theme.font.sans,
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: "36px",
            height: "36px",
            border: `3px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: "50%",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: "13px",
            color: theme.colors.textMuted,
            fontWeight: 500,
          }}
        >
          Loading...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleNavigation}
    >
      <div style={{ paddingBottom: "48px" }}>
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: 800,
                color: theme.colors.textMain,
                margin: "0 0 4px",
                letterSpacing: "-0.025em",
              }}
            >
              Live Classes
            </h1>
            <p
              style={{
                color: theme.colors.textSecondary,
                margin: 0,
                fontSize: "13px",
              }}
            >
              Join ongoing sessions, manage your schedule, and review past
              lectures.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              background: theme.colors.primaryFaint,
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: theme.borderRadius.full,
            }}
          >
            <Video size={12} color={theme.colors.primary} />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.colors.primary,
              }}
            >
              Live Classes
            </span>
          </div>
        </div>

        <OngoingClass />
        <TodayClasses />
        <UpcomingClasses />
        <PastClasses />
      </div>
    </DashboardLayout>
  );
}
