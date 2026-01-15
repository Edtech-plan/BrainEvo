import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/shared/hooks/useAuth';
import type { UserRole } from '../../src/shared/types';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Role-based validation: Only learners should access this dashboard
  React.useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = (user as any)?.role as UserRole;

      // Redirect based on role
      if (userRole === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (userRole === 'organization_admin') {
        router.push('/admin/dashboard');
      }
      // If role is 'learner' or undefined, stay on this page
    }
  }, [loading, isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Placeholder for UI - your friend will implement the dashboard UI here
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard UI will be implemented here */}
    </div>
  );
};

export default Dashboard;
