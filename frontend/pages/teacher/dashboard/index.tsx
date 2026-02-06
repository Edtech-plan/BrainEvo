import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Calendar,
  Video,
} from 'lucide-react';

import { useAuth } from '../../../src/features/auth/hooks/useAuth';
import { DashboardLayout } from '../../../src/shared/components/layout';
import { theme } from '../../../src/shared/components/ui/theme';
import { getDashboardRoute } from '../../../src/shared/utils/routing';
import type { UserRole } from '../../../src/shared/types';

type Section =
  | 'overview'
  | 'live-classes'
  | 'calendar'
  | 'projects'
  | 'resources'
  | 'messages'
  | 'settings';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeSection] = useState<Section>('overview');

  // Redirect unauthenticated users and non-teachers
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!loading && isAuthenticated && user) {
      const role: UserRole = user.role;
      if (role !== 'teacher') {
        router.push(getDashboardRoute(role));
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Disabled navigation handler - no real routing yet
  const handleSectionChange = (section: string): void => {
    // Keep sidebar UI but do not navigate anywhere yet
    // This can later be replaced with real routing logic
    // eslint-disable-next-line no-console
    console.log(`Teacher navigation clicked: ${section} (not wired yet)`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'live-classes', label: 'Live Classes', icon: <Video size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'projects', label: 'Assignments', icon: <FolderKanban size={20} /> },
    { id: 'resources', label: 'Resources', icon: <Library size={20} /> },
    { id: 'messages', label: 'Messages', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.bgMain,
        }}
      >
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${theme.colors.border}`,
            borderTopColor: theme.colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
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
      <div style={{ paddingBottom: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: theme.colors.textMain,
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Welcome back, {user.name || 'Teacher'}!
          </h1>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: '16px',
              margin: 0,
            }}
          >
            This is your teacher dashboard. Sidebar navigation is visible but
            not yet connected to features.
          </p>
        </div>

        <div
          style={{
            backgroundColor: theme.colors.bgSurface,
            padding: '40px',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: '16px',
              margin: 0,
            }}
          >
            Teacher dashboard features are coming soon.
          </p>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: '14px',
              marginTop: '8px',
              margin: 0,
            }}
          >
            You&apos;ll soon be able to manage classes, students, and analytics
            from here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

