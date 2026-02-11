const UserSettings = require('./settings.model');
const User = require('../user/user.model');

const DEFAULT_NOTIFICATIONS = {
  assignmentCreated: { email: true, inApp: true },
  gradeReleased: { email: true, inApp: true },
  liveClassReminders: { email: true, inApp: true },
  announcements: { email: false, inApp: true },
  quietHours: { enabled: true, start: '22:00', end: '08:00' },
};

function toProfile(user, settings) {
  return {
    id: user._id.toString(),
    fullName: user.name,
    email: user.email,
    phone: settings?.profile?.phone || '',
    headline: settings?.profile?.headline || '',
    avatarUrl: user.avatar || '',
    socialLinks: settings?.profile?.socialLinks || { linkedin: '', portfolio: '' },
  };
}

function toAppearance(settings) {
  return {
    theme: settings?.appearance?.theme || 'light',
    editorFontSize: settings?.appearance?.editorFontSize ?? 14,
    editorKeymap: settings?.appearance?.editorKeymap || 'vscode',
  };
}

function toAccount(settings) {
  return {
    timezone: settings?.account?.timezone || 'Asia/Kolkata',
    language: settings?.account?.language || 'en',
  };
}

function toNotifications(settings) {
  const n = settings?.notifications || {};
  return {
    assignmentCreated: { ...DEFAULT_NOTIFICATIONS.assignmentCreated, ...n.assignmentCreated },
    gradeReleased: { ...DEFAULT_NOTIFICATIONS.gradeReleased, ...n.gradeReleased },
    liveClassReminders: { ...DEFAULT_NOTIFICATIONS.liveClassReminders, ...n.liveClassReminders },
    announcements: { ...DEFAULT_NOTIFICATIONS.announcements, ...n.announcements },
    quietHours: { ...DEFAULT_NOTIFICATIONS.quietHours, ...n.quietHours },
  };
}

class SettingsService {
  async getSettings(userId) {
    const user = await User.findById(userId).select('name email avatar');
    if (!user) return null;

    let settings = await UserSettings.findOne({ user: userId });
    if (!settings) {
      settings = await UserSettings.create({ user: userId });
    }

    return {
      profile: toProfile(user, settings),
      appearance: toAppearance(settings),
      account: toAccount(settings),
      notifications: toNotifications(settings),
    };
  }

  async updateProfile(userId, data) {
    const user = await User.findById(userId);
    if (!user) return null;

    const profileUpdate = {};
    if (data.phone !== undefined) profileUpdate['profile.phone'] = data.phone;
    if (data.headline !== undefined) profileUpdate['profile.headline'] = data.headline;
    if (data.socialLinks !== undefined) profileUpdate['profile.socialLinks'] = data.socialLinks;

    if (Object.keys(profileUpdate).length > 0) {
      await UserSettings.findOneAndUpdate(
        { user: userId },
        { $set: profileUpdate },
        { new: true, upsert: true }
      );
    }

    if (data.avatarUrl !== undefined) {
      user.avatar = data.avatarUrl;
      await user.save();
    }
    if (data.fullName !== undefined) {
      user.name = data.fullName;
      await user.save();
    }

    return this.getSettings(userId);
  }

  async updateAppearance(userId, data) {
    await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: { appearance: data } },
      { new: true, upsert: true }
    );
    return this.getSettings(userId);
  }

  async updateAccount(userId, data) {
    await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: { account: data } },
      { new: true, upsert: true }
    );
    return this.getSettings(userId);
  }

  async updateNotifications(userId, data) {
    await UserSettings.findOneAndUpdate(
      { user: userId },
      { $set: { notifications: data } },
      { new: true, upsert: true }
    );
    return this.getSettings(userId);
  }
}

module.exports = new SettingsService();
