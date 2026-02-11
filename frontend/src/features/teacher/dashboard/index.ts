// src/features/teacher/dashboard/index.ts

/**
 * Teacher Dashboard Feature Exports
 * Centralized exports for the teacher dashboard module
 */

// Services
export { DashboardService } from './services/dashboard.service';

// Hooks
export { useDashboardMetrics } from './hooks/useDashboardMetrics';
export { useActivityFeed } from './hooks/useActivityFeed';
export { useLiveStatus } from './hooks/useLiveStatus';

// Components
export * from './components';
