import { useState, useEffect } from 'react';
import { ClassSession } from '../../../../shared/types/dashboard.types';
import { DashboardService } from '../services/dashboard.service';

export const useLiveStatus = () => {
  const [nextClass, setNextClass] = useState<ClassSession | null>(null);
  const [schedule, setSchedule] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DashboardService.getScheduleData()
      .then((data) => {
        setNextClass(data.nextClass);
        setSchedule(data.todaySchedule);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { nextClass, schedule, loading };
};
