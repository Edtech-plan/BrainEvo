import { useState, useEffect } from 'react';
import settingsService from '../services/settings.service';
import { LoginSession } from '@/shared/types/settings.types';

export const useSecurity = () => {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    settingsService.getLoginHistory().then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const changePassword = async (current: string, newPass: string) => {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (current === 'wrong') reject('Incorrect current password');
        else resolve(true);
      }, 1500);
    });
  };

  return { sessions, loading, changePassword };
};
