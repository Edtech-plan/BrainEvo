import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Calendar as CalendarIcon,
  Video,
} from 'lucide-react';
import { useStudentRoute } from '../../../src/shared/hooks';
import { DashboardLayout } from '../../../src/shared/components/layout';
import { theme } from '../../../styles/theme';
import {
  OngoingClass,
  TodayClasses,
  UpcomingClasses,
  PastClasses,
} from '@/features/student/live-classes';
import type { UserRole } from '../../../src/shared/types';

export default function LiveClasses() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useStudentRoute();
  const [activeSection] = useState('live-classes'); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const handleNavigation = (section: string) => {
    if (section === 'live-classes') {
      return; // Already on live-classes page
    }
    if (section === 'calendar') {
      router.push('/student/calendar');
      return;
    }
    if (section === 'overview') {
      router.push('/student/dashboard');
      return;
    }
    if (section === 'projects') {
      router.push('/student/assignment');
      return;
    }
    if (section === 'settings') {
      router.push('/student/settings');
      return;
    }
    // For other sections, navigate to dashboard with that section
    router.push(`/student/dashboard?section=${section}`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'live-classes', label: 'Live Classes', icon: <Video size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
    { id: 'projects', label: 'Assignments', icon: <FolderKanban size={20} /> },
    { id: 'resources', label: 'Resources', icon: <Library size={20} /> },
    { id: 'messages', label: 'Messages', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.colors.bgMain
      }}>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: '32px', height: '32px', border: `3px solid ${theme.colors.border}`,
          borderTopColor: theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
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
      <div style={{ paddingBottom: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: theme.colors.textMain,
            marginBottom: '4px',
            margin: 0
          }}>
            Live Classes
          </h1>
          <p style={{
            color: theme.colors.textSecondary,
            margin: 0,
            fontSize: '14px'
          }}>
            Manage your schedule, join ongoing sessions, and review past lectures.
          </p>
        </div>

        <OngoingClass />
        <TodayClasses />
        <UpcomingClasses />
        <PastClasses />
      </div>
    </DashboardLayout>
  );
}
