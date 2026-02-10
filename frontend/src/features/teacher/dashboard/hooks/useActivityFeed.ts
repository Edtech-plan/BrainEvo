import { useState, useEffect } from 'react';
import { ActivityLog } from '../../../../shared/types/dashboard.types';
import { DashboardService } from '../services/dashboard.service';

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getActivity()
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { activities, loading };
};
