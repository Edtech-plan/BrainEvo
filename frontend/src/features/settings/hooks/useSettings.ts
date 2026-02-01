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
      if (!settings) setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
      setError('');
    } catch (err) {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Initial Fetch + Real-time Subscription
  useEffect(() => {
    fetchSettings();

    // Subscribe to the service to get updates from other components
    const unsubscribe = settingsService.subscribe((newData) => {
      setSettings(newData);
    });

    return () => unsubscribe();
  }, []);

  const updateSection = async <T>(
    sectionKey: keyof UserSettingsResponse, 
    newData: Partial<T>, 
    apiCall: (data: Partial<T>) => Promise<boolean>
  ) => {
    if (!settings) return;
    setSaving(true);
    try {
      await apiCall(newData);
      // No need to setSettings here, subscription handles it
      return true;
    } catch (err) {
      setError(`Failed to update ${sectionKey}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Orchestrates the Upload -> Update Profile flow
  const uploadAvatar = async (file: File) => {
    setSaving(true);
    try {
      // 1. Upload to get URL
      const url = await settingsService.uploadAvatar(file);
      // 2. Update Profile with new URL
      await settingsService.updateProfile({ avatarUrl: url });
      return true;
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
