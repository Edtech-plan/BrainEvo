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

// Feature Imports
import {
  BatchesList,
  BatchDetail,
} from "../../../src/features/teacher/batches";

type Section =
  | "overview"
  | "batches"
  | "assignments"
  | "live-classes"
  | "insights"
  | "settings";

export default function TeacherBatchesPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // State for Sidebar Tab
  const [activeSection, setActiveSection] = useState<Section>("batches");
  // State for Batches Feature (List vs Detail)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

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

  // 2. Navigation Handler
  const handleSectionChange = (sectionId: string) => {
    // If clicking "Dashboard", go back to the Home Page
    if (sectionId === "overview") {
      router.push("/teacher/dashboard");
      return;
    }

    // If clicking "Batches", reset the Detail view if open
    if (sectionId === "batches") {
      setSelectedBatchId(null);
    }

    // Update local state to render content or placeholder
    setActiveSection(sectionId as Section);
  };

  // 3. Sidebar Config
  const navItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "batches", label: "Batches", icon: <Users size={20} /> },
    {
      id: "assignments",
      label: "Assignments",
      icon: <ClipboardList size={20} />,
    },
    { id: "live-classes", label: "Live Classes", icon: <Video size={20} /> },
    { id: "insights", label: "Insights", icon: <BarChart2 size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
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
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: "32px",
            height: "32px",
            border: `3px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      {/* 
        LOGIC SWITCH:
        1. If 'batches', show List or Detail.
        2. If anything else, show Placeholder.
      */}
      {activeSection === "batches" ? (
        selectedBatchId ? (
          <BatchDetail
            batchId={selectedBatchId}
            onBack={() => setSelectedBatchId(null)}
          />
        ) : (
          <BatchesList onSelectBatch={(id: string) => setSelectedBatchId(id)} />
        )
      ) : (
        // Placeholder for other sections
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.bgSurface,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
            Section
          </h3>
          <p>This module is under development.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
