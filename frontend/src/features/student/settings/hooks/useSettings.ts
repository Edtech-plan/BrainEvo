import { useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settings.service';
import { 
  UserSettingsResponse, 
  StudentProfile, 
  AppearanceSettings, 
  AccountSettings, 
  NotificationSettings 
} from '@/shared/types/settings.types';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettingsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const fetchSettings = useCallback(async () => {
    try {
      // FIX: Removed dependency on 'settings' to prevent infinite loops
      // We check if data exists locally to decide on the loading spinner
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setError('');
    } catch (err) {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies now empty

  useEffect(() => {
    fetchSettings();
    const unsubscribe = settingsService.subscribe((newData) => {
      setSettings(newData);
    });
    return () => unsubscribe();
  }, [fetchSettings]);

  const updateSection = async <T>(
    sectionKey: keyof UserSettingsResponse,
    newData: Partial<T>,
    apiCall: (data: Partial<T>) => Promise<{ success: boolean; data?: UserSettingsResponse }>
  ) => {
    if (!settings) return false;
    setSaving(true);
    try {
      const result = await apiCall(newData);
      if (result.success && result.data) {
        setSettings(result.data);
      }
      return result.success;
    } catch (err) {
      setError(`Failed to update ${sectionKey}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    setSaving(true);
    try {
      const url = await settingsService.uploadAvatar(file);
      const result = await settingsService.updateProfile({ avatarUrl: url });
      if (result.success && result.data) {
        setSettings(result.data);
      }
      return result.success;
    } catch (err) {
      setError('Failed to upload avatar.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    error,
    saving,
    refresh: fetchSettings,
    uploadAvatar,
    updateProfile: (data: Partial<StudentProfile>) =>
      updateSection<StudentProfile>('profile', data, settingsService.updateProfile),
    updateAppearance: (data: Partial<AppearanceSettings>) =>
      updateSection<AppearanceSettings>('appearance', data, settingsService.updateAppearance),
    updateAccount: (data: Partial<AccountSettings>) =>
      updateSection<AccountSettings>('account', data, settingsService.updateAccount),
    updateNotifications: (data: Partial<NotificationSettings>) =>
      updateSection<NotificationSettings>('notifications', data, settingsService.updateNotifications),
  };
};
