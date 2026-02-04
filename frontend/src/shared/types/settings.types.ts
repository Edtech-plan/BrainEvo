export type ThemeMode = 'light' | 'dark' | 'system';
export type EditorKeymap = 'vscode' | 'vim' | 'sublime';

// 1. Profile Data - All fields required, use "" for empty states
export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;     
  avatarUrl: string;    
  socialLinks: {
    linkedin: string;
    portfolio: string;
  };
}

// 2. Appearance
export interface AppearanceSettings {
  theme: ThemeMode;
  editorFontSize: number;
  editorKeymap: EditorKeymap;
}

// 3. Account
export interface AccountSettings {
  timezone: string;
  language: string;
}

// 4. Notifications
export interface NotificationChannel {
  email: boolean;
  inApp: boolean;
}

export interface NotificationSettings {
  assignmentCreated: NotificationChannel;
  gradeReleased: NotificationChannel;
  liveClassReminders: NotificationChannel;
  announcements: NotificationChannel;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// 5. Security / Login History
export interface LoginSession {
  id: string;
  device: string;      
  location: string;    
  ipAddress: string;   
  lastActive: string;  
  isCurrent: boolean;
}

// 6. API Response
export interface UserSettingsResponse {
  profile: StudentProfile;
  appearance: AppearanceSettings;
  account: AccountSettings;
  notifications: NotificationSettings;
}
