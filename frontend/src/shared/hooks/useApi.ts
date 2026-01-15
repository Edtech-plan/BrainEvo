import { useState, useEffect } from 'react';
import apiClient from '../lib/axios';
import type { AppErrorType } from '../types/errors.types';
import { getErrorMessage } from '../types/errors.types';

/**
 * API Hook
 */
export const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<T>(url);
        setData(response.data);
      } catch (err: AppErrorType) {
        setError(getErrorMessage(err) || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
