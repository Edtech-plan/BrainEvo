// Types derived directly from the team's test file contracts.
// Zero `any` — every field is explicit and required.

export interface SocialLinks {
  linkedin:  string;
  portfolio: string;
}

export interface ProfileData {
  id:          string;
  fullName:    string;
  email:       string;      // read-only; changed via account flow
  phone:       string;
  headline:    string;
  avatarUrl:   string;
  socialLinks: SocialLinks;
}

export interface AppearanceData {
  theme:          'light' | 'dark' | 'system';
  editorFontSize: number;
  editorKeymap:   'vscode' | 'vim' | 'emacs';
}

export interface AccountData {
  timezone: string;
  language: string;
}

export interface NotificationChannel {
  email: boolean;
  inApp: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start:   string; // 'HH:MM'
  end:     string; // 'HH:MM'
}

export interface NotificationsData {
  assignmentCreated:  NotificationChannel;
  gradeReleased:      NotificationChannel;
  liveClassReminders: NotificationChannel;
  announcements:      NotificationChannel;
  quietHours:         QuietHours;
}

export interface FullSettings {
  profile:       ProfileData;
  appearance:    AppearanceData;
  account:       AccountData;
  notifications: NotificationsData;
}

// Returned by every update method
export interface ServiceResponse {
  success: boolean;
  data?:   FullSettings;
}

// Used only by the password-change flow (not persisted in FullSettings)
export interface PasswordPayload {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

export type SettingsSection = 'profile' | 'account' | 'notifications' | 'appearance';
