import settingsService from '../settings.service';
import apiClient from '../../../../../shared/lib/axios';

jest.mock('../../../../../shared/lib/axios');

const mockSettings = {
  profile: {
    id: 'user123',
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '',
    headline: '',
    avatarUrl: '',
    socialLinks: { linkedin: '', portfolio: '' },
  },
  appearance: {
    theme: 'light' as const,
    editorFontSize: 14,
    editorKeymap: 'vscode' as const,
  },
  account: {
    timezone: 'Asia/Kolkata',
    language: 'en',
  },
  notifications: {
    assignmentCreated: { email: true, inApp: true },
    gradeReleased: { email: true, inApp: true },
    liveClassReminders: { email: true, inApp: true },
    announcements: { email: false, inApp: true },
    quietHours: { enabled: true, start: '22:00', end: '08:00' },
  },
};

describe('SettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should fetch settings successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: mockSettings,
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await settingsService.getSettings();

      expect(apiClient.get).toHaveBeenCalledWith('/api/settings');
      expect(result).toEqual(mockSettings);
      expect(result.profile.email).toBe('test@example.com');
      expect(result.appearance.theme).toBe('light');
    });

    it('should throw when API returns failure', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        data: { success: false },
      });

      await expect(settingsService.getSettings()).rejects.toThrow('Failed to load settings');
    });

    it('should throw when data is missing', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        data: { success: true },
      });

      await expect(settingsService.getSettings()).rejects.toThrow('Failed to load settings');
    });
  });

  describe('updateProfile', () => {
    it('should update profile and return success with data', async () => {
      const updatedSettings = { ...mockSettings, profile: { ...mockSettings.profile, fullName: 'Updated Name' } };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: updatedSettings },
      });

      const result = await settingsService.updateProfile({ fullName: 'Updated Name' });

      expect(apiClient.put).toHaveBeenCalledWith('/api/settings/profile', { fullName: 'Updated Name' });
      expect(result.success).toBe(true);
      expect(result.data?.profile.fullName).toBe('Updated Name');
    });
  });

  describe('updateAppearance', () => {
    it('should update appearance settings', async () => {
      const updatedSettings = { ...mockSettings, appearance: { ...mockSettings.appearance, theme: 'dark' } };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: updatedSettings },
      });

      const result = await settingsService.updateAppearance({ theme: 'dark' });

      expect(apiClient.put).toHaveBeenCalledWith('/api/settings/appearance', { theme: 'dark' });
      expect(result.success).toBe(true);
      expect(result.data?.appearance.theme).toBe('dark');
    });
  });

  describe('updateAccount', () => {
    it('should update account settings', async () => {
      const updatedSettings = { ...mockSettings, account: { ...mockSettings.account, timezone: 'UTC' } };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: updatedSettings },
      });

      const result = await settingsService.updateAccount({ timezone: 'UTC' });

      expect(apiClient.put).toHaveBeenCalledWith('/api/settings/account', { timezone: 'UTC' });
      expect(result.success).toBe(true);
      expect(result.data?.account.timezone).toBe('UTC');
    });
  });

  describe('updateNotifications', () => {
    it('should update notification settings', async () => {
      const updateData = { quietHours: { enabled: false } };
      const updatedSettings = {
        ...mockSettings,
        notifications: { ...mockSettings.notifications, quietHours: { ...mockSettings.notifications.quietHours, enabled: false } },
      };
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: { success: true, data: updatedSettings },
      });

      const result = await settingsService.updateNotifications(updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/api/settings/notifications', updateData);
      expect(result.success).toBe(true);
    });
  });

  describe('uploadAvatar', () => {
    it('should upload avatar and return avatar URL', async () => {
      const base64Url = 'data:image/png;base64,abc123';
      (apiClient.put as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          data: {
            ...mockSettings,
            profile: { ...mockSettings.profile, avatarUrl: base64Url },
          },
        },
      });

      const file = new File(['test'], 'avatar.png', { type: 'image/png' });
      const result = await settingsService.uploadAvatar(file);

      expect(result).toBe(base64Url);
      expect(apiClient.put).toHaveBeenCalledWith('/api/settings/profile', { avatarUrl: expect.any(String) });
    });

    it('should reject file over 5MB', async () => {
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });

      await expect(settingsService.uploadAvatar(largeFile)).rejects.toThrow('File size exceeds 5MB limit.');
    });

    it('should reject non-image files', async () => {
      const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' });

      await expect(settingsService.uploadAvatar(file)).rejects.toThrow('Invalid file type.');
    });
  });

  describe('subscribe', () => {
    it('should return unsubscribe function', () => {
      const unsubscribe = settingsService.subscribe(() => {});

      expect(typeof unsubscribe).toBe('function');
      expect(() => unsubscribe()).not.toThrow();
    });
  });
});
