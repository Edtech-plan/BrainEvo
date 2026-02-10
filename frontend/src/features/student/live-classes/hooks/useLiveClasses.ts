import { useState, useEffect, useMemo } from 'react';
import liveClassService from '../services/liveClass.service';
import type { LiveClass } from '../../../../shared/types';
import type { AppErrorType } from '../../../../shared/types/errors.types';
import { getErrorMessage } from '../../../../shared/types/errors.types';

/**
 * Live Classes Hook
 * Fetches and manages live classes data
 */
export const useLiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await liveClassService.getLiveClasses();
      if (response.success) {
        setLiveClasses(response.data || []);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err as AppErrorType);
      setError(errorMessage || 'Failed to fetch live classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  // Filter live classes by status
  const ongoingClasses = useMemo(() => {
    const now = new Date();
    return liveClasses.filter((liveClass) => {
      const startTime = new Date(liveClass.scheduledAt);
      const endTime = new Date(startTime.getTime() + (liveClass.duration || 60) * 60 * 1000);
      return now >= startTime && now <= endTime;
    });
  }, [liveClasses]);

  const todayClasses = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return liveClasses.filter((liveClass) => {
      const startTime = new Date(liveClass.scheduledAt);
      return startTime >= today && startTime < tomorrow;
    });
  }, [liveClasses]);

  const upcomingClasses = useMemo(() => {
    const now = new Date();
    return liveClasses.filter((liveClass) => {
      const startTime = new Date(liveClass.scheduledAt);
      return startTime > now;
    });
  }, [liveClasses]);

  const pastClasses = useMemo(() => {
    const now = new Date();
    return liveClasses.filter((liveClass) => {
      const startTime = new Date(liveClass.scheduledAt);
      const endTime = new Date(startTime.getTime() + (liveClass.duration || 60) * 60 * 1000);
      return endTime < now;
    });
  }, [liveClasses]);

  return {
    liveClasses,
    ongoingClasses,
    todayClasses,
    upcomingClasses,
    pastClasses,
    loading,
    error,
    refetch: fetchLiveClasses,
  };
};
