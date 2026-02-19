import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Shield,
} from 'lucide-react';

import { useAuth } from '../../../src/features/auth/hooks/useAuth';
import { DashboardLayout } from '../../../src/shared/components/layout';
import { theme } from '../../../styles/theme';
import { getDashboardRoute } from '../../../src/shared/utils/routing';
import type { UserRole } from '../../../src/shared/types';
import { AdminOverview } from '../../../src/features/admin';

type Section = 'overview' | 'organizations' | 'users' | 'security' | 'settings';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeSection] = useState<Section>('overview');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!loading && isAuthenticated && user) {
      const role: UserRole = user.role;
      if (role !== 'organization_admin') {
        router.push(getDashboardRoute(role));
      }
    }
  }, [loading, isAuthenticated, user, router]);

  const handleSectionChange = (section: string): void => {
    // Admin navigation - overview is wired; others coming soon
    if (section === 'overview') return;
    // eslint-disable-next-line no-console
    console.log(`Admin section: ${section} (coming soon)`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'organizations', label: 'Organizations', icon: <Building2 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
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
      <AdminOverview />
    </DashboardLayout>
  );
}

