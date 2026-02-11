const settingsService = require('backend/src/modules/settings/settings.service');
const UserSettings = require('backend/src/modules/settings/settings.model');
const User = require('backend/src/modules/user/user.model');

jest.mock('backend/src/modules/settings/settings.model');
jest.mock('backend/src/modules/user/user.model');

const { createMockUser, TEST_USER_ID } = require('../helpers/test-utils');

describe('SettingsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should return settings for user, creating defaults if none exist', async () => {
      const mockUser = createMockUser({ avatar: null });
      const mockSettings = {
        user: TEST_USER_ID,
        profile: { phone: '', headline: '', socialLinks: { linkedin: '', portfolio: '' } },
        appearance: { theme: 'light', editorFontSize: 14, editorKeymap: 'vscode' },
        account: { timezone: 'Asia/Kolkata', language: 'en' },
        notifications: {},
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      UserSettings.findOne.mockResolvedValue(null);
      UserSettings.create.mockResolvedValue(mockSettings);

      const result = await settingsService.getSettings(TEST_USER_ID);

      expect(result).not.toBeNull();
      expect(result.profile.fullName).toBe('Test User');
      expect(result.profile.email).toBe('test@example.com');
      expect(result.appearance.theme).toBe('light');
      expect(result.account.timezone).toBe('Asia/Kolkata');
      expect(User.findById).toHaveBeenCalledWith(TEST_USER_ID);
      expect(UserSettings.findOne).toHaveBeenCalledWith({ user: TEST_USER_ID });
      expect(UserSettings.create).toHaveBeenCalledWith({ user: TEST_USER_ID });
    });

    it('should return null when user not found', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const result = await settingsService.getSettings(TEST_USER_ID);

      expect(result).toBeNull();
      expect(User.findById).toHaveBeenCalledWith(TEST_USER_ID);
    });

    it('should return existing settings when user has settings', async () => {
      const mockUser = createMockUser({ avatar: 'https://example.com/avatar.png' });
      const mockSettings = {
        user: TEST_USER_ID,
        profile: { phone: '+1234567890', headline: 'Developer', socialLinks: { linkedin: 'https://linkedin.com', portfolio: '' } },
        appearance: { theme: 'dark', editorFontSize: 18, editorKeymap: 'vim' },
        account: { timezone: 'America/New_York', language: 'en' },
        notifications: {},
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      UserSettings.findOne.mockResolvedValue(mockSettings);

      const result = await settingsService.getSettings(TEST_USER_ID);

      expect(result).not.toBeNull();
      expect(result.profile.avatarUrl).toBe('https://example.com/avatar.png');
      expect(result.profile.phone).toBe('+1234567890');
      expect(result.profile.headline).toBe('Developer');
      expect(result.appearance.theme).toBe('dark');
      expect(result.appearance.editorKeymap).toBe('vim');
      expect(result.account.timezone).toBe('America/New_York');
    });
  });

  describe('updateProfile', () => {
    it('should update user name and avatar when provided', async () => {
      const mockUser = {
        ...createMockUser(),
        save: jest.fn().mockResolvedValue(undefined),
      };
      const mockSettings = { user: TEST_USER_ID, profile: {} };
      const chainable = {
        select: jest.fn().mockResolvedValue(mockUser),
        then: (cb) => Promise.resolve(mockUser).then(cb),
        catch: (cb) => Promise.resolve(mockUser).catch(cb),
      };

      User.findById.mockReturnValue(chainable);
      UserSettings.findOne.mockResolvedValue(mockSettings);
      UserSettings.findOneAndUpdate.mockResolvedValue(mockSettings);

      const result = await settingsService.updateProfile(TEST_USER_ID, {
        fullName: 'Updated Name',
        avatarUrl: 'https://example.com/new-avatar.png',
      });

      expect(result).not.toBeNull();
      expect(mockUser.name).toBe('Updated Name');
      expect(mockUser.avatar).toBe('https://example.com/new-avatar.png');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should update settings profile fields', async () => {
      const mockUser = createMockUser();
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      UserSettings.findOne.mockResolvedValue({});
      UserSettings.findOneAndUpdate.mockResolvedValue({});

      await settingsService.updateProfile(TEST_USER_ID, {
        phone: '+9876543210',
        headline: 'Full Stack Dev',
        socialLinks: { linkedin: 'https://linkedin.com/in/john', portfolio: 'https://john.dev' },
      });

      expect(UserSettings.findOneAndUpdate).toHaveBeenCalledWith(
        { user: TEST_USER_ID },
        expect.objectContaining({
          $set: expect.objectContaining({
            'profile.phone': '+9876543210',
            'profile.headline': 'Full Stack Dev',
            'profile.socialLinks': { linkedin: 'https://linkedin.com/in/john', portfolio: 'https://john.dev' },
          }),
        }),
        { new: true, upsert: true }
      );
    });

    it('should return null when user not found', async () => {
      User.findById.mockResolvedValue(null);

      const result = await settingsService.updateProfile(TEST_USER_ID, { fullName: 'New' });

      expect(result).toBeNull();
    });
  });

  describe('updateAppearance', () => {
    it('should update appearance settings', async () => {
      const mockUser = createMockUser();
      const mockSettings = { appearance: { theme: 'dark', editorFontSize: 16 } };

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      UserSettings.findOne.mockResolvedValue(mockSettings);
      UserSettings.findOneAndUpdate.mockResolvedValue(mockSettings);

      const result = await settingsService.updateAppearance(TEST_USER_ID, {
        theme: 'dark',
        editorFontSize: 16,
      });

      expect(result).not.toBeNull();
      expect(UserSettings.findOneAndUpdate).toHaveBeenCalledWith(
        { user: TEST_USER_ID },
        { $set: { appearance: { theme: 'dark', editorFontSize: 16 } } },
        { new: true, upsert: true }
      );
    });
  });

  describe('updateAccount', () => {
    it('should update account settings', async () => {
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(createMockUser()) });
      UserSettings.findOne.mockResolvedValue({ account: {} });
      UserSettings.findOneAndUpdate.mockResolvedValue({});

      const result = await settingsService.updateAccount(TEST_USER_ID, {
        timezone: 'Europe/London',
        language: 'en',
      });

      expect(result).not.toBeNull();
      expect(UserSettings.findOneAndUpdate).toHaveBeenCalledWith(
        { user: TEST_USER_ID },
        { $set: { account: { timezone: 'Europe/London', language: 'en' } } },
        { new: true, upsert: true }
      );
    });
  });

  describe('updateNotifications', () => {
    it('should update notification settings', async () => {
      const updateData = {
        assignmentCreated: { email: false, inApp: true },
        quietHours: { enabled: false },
      };

      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(createMockUser()) });
      UserSettings.findOne.mockResolvedValue({ notifications: {} });
      UserSettings.findOneAndUpdate.mockResolvedValue({});

      const result = await settingsService.updateNotifications(TEST_USER_ID, updateData);

      expect(result).not.toBeNull();
      expect(UserSettings.findOneAndUpdate).toHaveBeenCalledWith(
        { user: TEST_USER_ID },
        { $set: { notifications: updateData } },
        { new: true, upsert: true }
      );
    });
  });
});
