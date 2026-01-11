import { useState, useEffect } from 'react';
import liveClassService from '../../modules/liveClass/liveClass.service';

/**
 * Live Classes Hook
 */
export const useLiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch live classes');
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
