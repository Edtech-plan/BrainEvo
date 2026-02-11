import apiClient from '../../../../shared/lib/axios';
import type {
  UserSettingsResponse,
  StudentProfile,
  AppearanceSettings,
  AccountSettings,
  NotificationSettings,
  LoginSession,
} from '../../../../shared/types/settings.types';

const API_BASE = '/api/settings';

/**
 * Convert File to base64 data URL for avatar upload
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

class SettingsService {
  async getSettings(): Promise<UserSettingsResponse> {
    const response = await apiClient.get<{ success: boolean; data: UserSettingsResponse }>(API_BASE);
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to load settings');
    }
    return response.data.data;
  }

  subscribe(_listener: (data: UserSettingsResponse) => void): () => void {
    return () => {};
  }

  async uploadAvatar(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit.');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type.');
    }
    const base64 = await fileToBase64(file);
    const response = await apiClient.put<{ success: boolean; data: UserSettingsResponse }>(`${API_BASE}/profile`, {
      avatarUrl: base64,
    });
    if (!response.data.success || !response.data.data?.profile?.avatarUrl) {
      throw new Error('Failed to upload avatar.');
    }
    return response.data.data.profile.avatarUrl;
  }

  async updateProfile(data: Partial<StudentProfile>): Promise<{ success: boolean; data?: UserSettingsResponse }> {
    const payload: Record<string, unknown> = {};
    if (data.fullName !== undefined) payload.fullName = data.fullName;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.headline !== undefined) payload.headline = data.headline;
    if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl;
    if (data.socialLinks !== undefined) payload.socialLinks = data.socialLinks;

    const response = await apiClient.put<{ success: boolean; data: UserSettingsResponse }>(`${API_BASE}/profile`, payload);
    return { success: response.data.success === true, data: response.data.data };
  }

  async updateAppearance(data: Partial<AppearanceSettings>): Promise<{ success: boolean; data?: UserSettingsResponse }> {
    const response = await apiClient.put<{ success: boolean; data: UserSettingsResponse }>(`${API_BASE}/appearance`, data);
    return { success: response.data.success === true, data: response.data.data };
  }

  async updateAccount(data: Partial<AccountSettings>): Promise<{ success: boolean; data?: UserSettingsResponse }> {
    const response = await apiClient.put<{ success: boolean; data: UserSettingsResponse }>(`${API_BASE}/account`, data);
    return { success: response.data.success === true, data: response.data.data };
  }

  async updateNotifications(data: Partial<NotificationSettings>): Promise<{ success: boolean; data?: UserSettingsResponse }> {
    const response = await apiClient.put<{ success: boolean; data: UserSettingsResponse }>(`${API_BASE}/notifications`, data);
    return { success: response.data.success === true, data: response.data.data };
  }

  async getLoginHistory(): Promise<LoginSession[]> {
    return Promise.resolve([
      {
        id: '1',
        device: 'Chrome (Windows)',
        location: 'Mumbai',
        ipAddress: '192.168.1.5',
        lastActive: new Date().toISOString(),
        isCurrent: true,
      },
    ]);
  }
}

export default new SettingsService();
