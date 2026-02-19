import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useStudentRoute } from "@/shared/hooks";
import { DashboardLayout } from "@/shared/components/layout";
import { theme } from "@/styles/theme";
import { CalendarView } from "@/features/student/calendar";
import {
  LayoutDashboard,
  Video,
  Calendar as CalendarIcon,
  FolderKanban,
  Library,
  Bell,
  Settings,
} from "lucide-react";

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useStudentRoute();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

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
          Loading calendar...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={20} /> },
    { id: "live-classes", label: "Live Classes", icon: <Video size={20} /> },
    { id: "calendar", label: "Calendar", icon: <CalendarIcon size={20} /> },
    { id: "projects", label: "Assignments", icon: <FolderKanban size={20} /> },
    { id: "resources", label: "Resources", icon: <Library size={20} /> },
    { id: "messages", label: "Messages", icon: <Bell size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleNavigation = (id: string) => {
    const routes: Record<string, string> = {
      overview: "/student/dashboard",
      "live-classes": "/student/live-classes",
      calendar: "/student/calendar",
      projects: "/student/assignment",
      settings: "/student/settings",
    };
    if (routes[id]) router.push(routes[id]);
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection="calendar"
      onSectionChange={handleNavigation}
    >
      <CalendarView />
    </DashboardLayout>
  );
}
