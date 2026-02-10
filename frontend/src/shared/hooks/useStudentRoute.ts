import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { getDashboardRoute } from '../utils/routing';
import type { UserRole } from '../types';

/**
 * Hook to protect student-only routes.
 * Redirects non-learner roles to their respective dashboards.
 */
export const useStudentRoute = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role: UserRole = user.role;
      if (role !== 'learner') {
        router.push(getDashboardRoute(role));
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return { user, isAuthenticated, loading };
};

