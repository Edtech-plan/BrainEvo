import { useState, useEffect } from 'react';
import liveClassService from '../../modules/liveClass/liveClass.service';
import type { LiveClass } from '../types';
import type { AppErrorType } from '../types/errors.types';
import { getErrorMessage } from '../types/errors.types';

/**
 * Live Classes Hook
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
    } catch (err: AppErrorType) {
      setError(getErrorMessage(err) || 'Failed to fetch live classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  return {
    liveClasses,
    loading,
    error,
    fetchLiveClasses,
  };
};
