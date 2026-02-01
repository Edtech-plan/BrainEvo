import { 
  UserSettingsResponse, 
  StudentProfile, 
  AppearanceSettings, 
  AccountSettings, 
  NotificationSettings,
  LoginSession 
} from '@/shared/types/settings.types';

// Initial Mock Data (The "Database")
const INITIAL_DATA: UserSettingsResponse = {
  profile: {
    id: 'stu_123',
    fullName: 'Yash Pagdhare',
    email: 'yash.p@brainevo.com',
    phone: '+91 98765 43210',
    headline: 'Aspiring Full Stack Developer',
    avatarUrl: '', // Empty string = No Avatar initially
    socialLinks: { 
      linkedin: 'https://linkedin.com/in/yash', 
      portfolio: '' 
    }
  },
  appearance: {
    theme: 'light',
    editorFontSize: 14,
    editorKeymap: 'vscode'
  },
  account: {
    timezone: 'Asia/Kolkata',
    language: 'en'
  },
  notifications: {
    assignmentCreated: { email: true, inApp: true },
    gradeReleased: { email: true, inApp: true },
    liveClassReminders: { email: true, inApp: true },
    announcements: { email: false, inApp: true },
    quietHours: { enabled: true, start: '22:00', end: '08:00' }
  }
};

class SettingsService {
  // In-memory store to persist changes during the session
  private _data: UserSettingsResponse = JSON.parse(JSON.stringify(INITIAL_DATA));
  
  // Listeners to notify components of changes
  private _listeners: ((data: UserSettingsResponse) => void)[] = [];

  /**
   * Get current settings from memory
   * FIX: Converted to Arrow Function to preserve 'this' context
   */
    getSettings = async (): Promise<UserSettingsResponse> => {
    // Return immediately, no setTimeout needed for reading memory!
        return Promise.resolve(JSON.parse(JSON.stringify(this._data)));
    }


  /**
   * Subscribe to changes
   * FIX: Converted to Arrow Function
   */
  subscribe = (listener: (data: UserSettingsResponse) => void) => {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  /**
   * Internal helper to notify all subscribers
   */
  private _notify() {
    const freshData = JSON.parse(JSON.stringify(this._data));
    this._listeners.forEach(listener => listener(freshData));
  }

  /**
   * Simulate File Upload
   * FIX: Converted to Arrow Function
   */
  uploadAvatar = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (file.size > 5 * 1024 * 1024) {
          reject('File size exceeds 5MB limit.');
          return;
        }
        if (!file.type.startsWith('image/')) {
          reject('Invalid file type.');
          return;
        }
        const mockUrl = URL.createObjectURL(file);
        resolve(mockUrl);
      }, 1000);
    });
  }

  // --- Update Methods (Converted to Arrow Functions to fix the Error) ---

  updateProfile = async (data: Partial<StudentProfile>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 'this' is now safe to use here
        this._data.profile = { ...this._data.profile, ...data };
        this._notify(); 
        resolve(true);
      }, 800);
    });
  }

  updateAppearance = async (data: Partial<AppearanceSettings>): Promise<boolean> => {
    return new Promise((resolve) => {
      this._data.appearance = { ...this._data.appearance, ...data };
      this._notify();
      resolve(true);
    });
  }
  
  updateAccount = async (data: Partial<AccountSettings>): Promise<boolean> => {
    return new Promise((resolve) => {
      this._data.account = { ...this._data.account, ...data };
      this._notify();
      resolve(true);
    });
  }

  updateNotifications = async (data: Partial<NotificationSettings>): Promise<boolean> => {
    return new Promise((resolve) => {
      this._data.notifications = { ...this._data.notifications, ...data };
      this._notify();
      resolve(true);
    });
  }

  getLoginHistory = async (): Promise<LoginSession[]> => {
    return Promise.resolve([
      { id: '1', device: 'Chrome (Windows)', location: 'Mumbai', ipAddress: '192.168.1.5', lastActive: new Date().toISOString(), isCurrent: true }
    ]);
  }
}

// Export as Singleton
export default new SettingsService();
