// Feature root barrel — import SettingsLayout from here, not from deep paths.
export { SettingsLayout }        from './components';
export { default as settingsService } from './services/settings.service';
export { useProfileSettings }        from './hooks/useProfileSettings';
export { useAccountSettings }        from './hooks/useAccountSettings';
export { useNotificationSettings }   from './hooks/useNotificationSettings';
export { useAppearanceSettings }     from './hooks/useAppearanceSettings';
export { useProfileAvatar }          from './hooks/useProfileAvatar';