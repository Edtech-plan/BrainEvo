import type { UserRole } from '../types';

/**
 * Get dashboard route based on user role.
 */
export const getDashboardRoute = (role: UserRole | undefined): string => {
  const routes: Record<UserRole, string> = {
    learner: '/student/dashboard',
    teacher: '/teacher/dashboard',
    organization_admin: '/admin/dashboard',
  };

  return routes[role || 'learner'] || '/student/dashboard';
};

