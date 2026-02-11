import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users, // For "Batches"
  ClipboardList, // For "Assignments"
  Video, // For "Live Classes"
  BarChart2, // For "Insights"
  Settings,
} from 'lucide-react';

// Shared Imports
import { useAuth } from '../../../src/features/auth/hooks/useAuth';
import { DashboardLayout } from '../../../src/shared/components/layout';
import { theme } from '../../../src/shared/components/ui/theme';
import { getDashboardRoute } from '../../../src/shared/utils/routing';
import { UserRole } from '../../../src/shared/types';

// Feature Import: The main Assembler for the Dashboard Home
import { Overview } from '../../../src/features/teacher/dashboard/components';

type Section =
  | 'overview'
  | 'batches'
  | 'assignments'
  | 'live-classes'
  | 'insights'
  | 'settings';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  
  // State to track which sidebar tab is active
  const [activeSection, setActiveSection] = useState<Section>('overview');

  // 1. Auth Guard: Redirect if not logged in or not a teacher
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (user && user.role !== 'teacher') {
        router.push(getDashboardRoute(user.role as UserRole));
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // 2. Navigation Handler
  const handleSectionChange = (sectionId: string) => {
    const section = sectionId as Section;
    setActiveSection(section);
    
    // In the future, this will swap components based on `activeSection`.
    // For now, if they click anything else, we just log it or show a placeholder.
    if (section !== 'overview') {
      console.log(`Navigate to ${section} - Coming soon`);
    }
  };

  // 3. Teacher Sidebar Configuration
  const navItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      id: 'batches', 
      label: 'Batches', 
      icon: <Users size={20} /> 
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: <ClipboardList size={20} /> 
    },
    { 
      id: 'live-classes', 
      label: 'Live Classes', 
      icon: <Video size={20} /> 
    },
    { 
      id: 'insights', 
      label: 'Insights', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings size={20} /> 
    },
  ];

  // 4. Loading State
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

  // 5. Render Dashboard
  if (!isAuthenticated || !user) return null;

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      {/* 
        This is where we switch content based on the active tab.
        Currently, we only have the 'Overview' built.
      */}
      {activeSection === 'overview' ? (
        <Overview username={user.name} />
      ) : (
        // Placeholder for other sections until they are built
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.bgSurface,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`
        }}>
          <h3>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section</h3>
          <p>This module is under development.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
