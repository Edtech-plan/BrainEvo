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
import { useAuth } from '../../src/shared/hooks/useAuth';
import { DashboardLayout } from '../../src/shared/components/layout';
import { theme } from '../../src/shared/components/ui/theme';
// Import the main layout component directly from features

import type { UserRole } from '../../src/shared/types';
import AssignmentLayout from '@/features/assignment/components/AssignmentLayout';

export default function AssignmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeSection] = useState('projects'); 

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role = user.role as UserRole;
      if (role === 'teacher') router.push('/teacher/dashboard');
      else if (role === 'organization_admin') router.push('/admin/dashboard');
    }
  }, [loading, isAuthenticated, user, router]);

  const handleNavigation = (section: string) => {
    if (section === 'projects') return;
    
    const routes: Record<string, string> = {
      'live-classes': '/live-classes',
      'calendar': '/calendar',
      'overview': '/dashboard'
    };

    if (routes[section]) {
      router.push(routes[section]);
    } else {
      router.push(`/dashboard?section=${section}`);
    }
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
        <AssignmentLayout />
      </div>
    </DashboardLayout>
  );
}
