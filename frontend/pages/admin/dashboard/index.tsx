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
import { theme } from '../../../src/shared/components/ui/theme';
import { getDashboardRoute } from '../../../src/shared/utils/routing';
import type { UserRole } from '../../../src/shared/types';

type Section = 'overview' | 'organizations' | 'users' | 'security' | 'settings';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeSection] = useState<Section>('overview');

  // Redirect unauthenticated users and non-admins
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
    // Admin navigation is placeholder for now
    // eslint-disable-next-line no-console
    console.log(`Admin navigation clicked: ${section} (not wired yet)`);
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
            Welcome back, {user.name || 'Administrator'}!
          </h1>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: '16px',
              margin: 0,
            }}
          >
            This is your admin dashboard. Navigation is visible but not yet
            connected to admin features.
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
            Admin tools for managing organizations and users will appear here.
          </p>
          <p
            style={{
              color: theme.colors.textSecondary,
              fontSize: '14px',
              marginTop: '8px',
              margin: 0,
            }}
          >
            For now, this page is a placeholder for future admin features.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

