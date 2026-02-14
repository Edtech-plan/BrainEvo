import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Video,
  BarChart2,
  Settings,
} from "lucide-react";

// Shared Imports
import { useAuth } from "../../../src/features/auth/hooks/useAuth";
import { DashboardLayout } from "../../../src/shared/components/layout";
import { theme } from "../../../src/shared/components/ui/theme";
import { getDashboardRoute } from "../../../src/shared/utils/routing";
import { UserRole } from "../../../src/shared/types";

// Feature Import: The Live Class Studio Container
import { LiveClassesDashboard } from "../../../src/features/teacher/live-classes";

type Section =
  | "overview"
  | "batches"
  | "assignments"
  | "live-classes"
  | "insights"
  | "settings";

export default function TeacherLiveClassesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // Default active section is 'live-classes' for this page
  const [activeSection, setActiveSection] = useState<Section>("live-classes");

  // 1. Auth Guard
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      if (user && user.role !== "teacher") {
        router.push(getDashboardRoute(user.role as UserRole));
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // 2. Navigation Handler (Redirects to other pages)
  const handleSectionChange = (sectionId: string) => {
    switch (sectionId) {
      case "overview":
        router.push("/teacher/dashboard");
        break;
      case "batches":
        router.push("/teacher/batches");
        break;
      case "live-classes":
        // Already here, do nothing
        break;
      default:
        // For unbuilt pages, we might want to update state or show toast
        setActiveSection(sectionId as Section);
        console.log(`Navigate to ${sectionId} - Coming soon`);
        break;
    }
  };

  // 3. Sidebar Configuration (Must match Dashboard for consistency)
  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "batches",
      label: "Batches",
      icon: <Users size={20} />,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: <ClipboardList size={20} />,
    },
    {
      id: "live-classes",
      label: "Live Classes",
      icon: <Video size={20} />,
    },
    {
      id: "insights",
      label: "Insights",
      icon: <BarChart2 size={20} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  // 4. Loading State
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.bgMain,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: `3px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        >
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // 5. Render Layout wrapping the Feature
  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      <LiveClassesDashboard />
    </DashboardLayout>
  );
}
