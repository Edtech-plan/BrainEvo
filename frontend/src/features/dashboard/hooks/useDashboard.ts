import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboard.service';
import type { AppErrorType } from '../../../shared/types/errors.types';
import type { DashboardAnalytics } from '../../../shared/types/analytics.types';
import { getErrorMessage } from '../../../shared/types/errors.types';

/**
 * Dashboard Hook
 * Fetches and manages dashboard analytics data
 */
export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboardAnalytics();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err as AppErrorType);
      setError(errorMessage || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard,
  };
};
