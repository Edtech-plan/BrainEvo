import { useState, useEffect } from 'react';
import { DashboardStats } from '../../../../shared/types/dashboard.types';
import { DashboardService } from '../services/dashboard.service';

export const useDashboardMetrics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};
