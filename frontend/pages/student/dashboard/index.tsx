// pages/student/dashboard/index.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Calendar,
  Video,
} from "lucide-react";

import { useStudentRoute } from "../../../src/shared/hooks";
import { DashboardLayout } from "../../../src/shared/components/layout";
import { theme } from "../../../styles/theme";
import { Overview } from "@/features/student/dashboard";

type Section = "overview" | "projects" | "resources" | "messages" | "settings";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useStudentRoute();
  const [activeSection, setActiveSection] = useState<Section>("overview");

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          backgroundColor: theme.colors.bgMain,
          fontFamily: theme.font.sans,
        }}
      >
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Spinner */}
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

        {/* Label */}
        <span
          style={{
            fontSize: "13px",
            color: theme.colors.textMuted,
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // ── Navigation handler ────────────────────────────────────────────────────
  const handleNavigation = (section: string) => {
    if (section === "calendar") {
      router.push("/student/calendar");
      return;
    }
    if (section === "live-classes") {
      router.push("/student/live-classes");
      return;
    }
    if (section === "projects") {
      router.push("/student/assignment");
      return;
    }
    if (section === "settings") {
      router.push("/student/settings");
      return;
    }
    setActiveSection(section as Section);
  };

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "live-classes", label: "Live Classes", icon: <Video size={20} /> },
    { id: "calendar", label: "Calendar", icon: <Calendar size={20} /> },
    { id: "projects", label: "Assignments", icon: <FolderKanban size={20} /> },
    { id: "resources", label: "Resources", icon: <Library size={20} /> },
    { id: "messages", label: "Messages", icon: <Bell size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleNavigation}
    >
      {activeSection === "overview" && <Overview />}
    </DashboardLayout>
  );
}
