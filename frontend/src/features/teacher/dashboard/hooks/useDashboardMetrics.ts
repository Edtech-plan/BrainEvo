import { useState, useEffect } from 'react';
import { DashboardStats } from '../../../../shared/types/dashboard.types';
import { DashboardService } from '../services/dashboard.service';

export const useDashboardMetrics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    DashboardService.getStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard metrics');
          console.error('Metrics Error:', err);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return { stats, loading, error };
};
