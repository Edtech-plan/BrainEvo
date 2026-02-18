import React, { useState, memo } from 'react';
import { theme } from '@/styles/theme';
import { useSettings } from '../hooks/useSettings';
import { User, Lock, Bell, Palette, Globe } from 'lucide-react';
import { 
  StudentProfile, 
  AppearanceSettings, 
  AccountSettings, 
  NotificationSettings 
} from '@/shared/types/settings.types';

import { 
  ProfileHeader, PersonalInfoForm, SocialLinksForm,
  AppearanceTab, SecurityTab, NotificationTab, AccountTab
} from './index';

// --- Memoized Components ---

interface ProfileSectionProps {
  profile: StudentProfile;
  updateProfile: (data: Partial<StudentProfile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  saving: boolean;
}

const ProfileSection = memo(({ profile, updateProfile, uploadAvatar, saving }: ProfileSectionProps) => {
  return (
    <>
      <ProfileHeader 
        profile={profile} 
        onUpdate={async (url: string) => {
          const result = await updateProfile({ avatarUrl: url });
          return result === true;
        }} 
        onUpload={uploadAvatar}
        isUploading={saving}    
      />
      <PersonalInfoForm 
        profile={profile} 
        onSave={async (data: Partial<StudentProfile>) => {
          const result = await updateProfile(data);
          return result === true;
        }} 
      />
      <SocialLinksForm 
        links={profile.socialLinks} 
        onSave={async (data: Partial<StudentProfile>) => {
          const result = await updateProfile(data);
          return result === true;
        }} 
      />
    </>
  );
});
// FIX: Add Display Name
ProfileSection.displayName = 'ProfileSection';

interface AppearanceSectionProps {
  settings: AppearanceSettings;
  onUpdate: (data: Partial<AppearanceSettings>) => Promise<boolean>;
}

const AppearanceSection = memo(({ settings, onUpdate }: AppearanceSectionProps) => (
  <AppearanceTab settings={settings} onUpdate={onUpdate} />
));
// FIX: Add Display Name
AppearanceSection.displayName = 'AppearanceSection';

interface AccountSectionProps {
  settings: AccountSettings;
  onUpdate: (data: Partial<AccountSettings>) => Promise<boolean>;
}

const AccountSection = memo(({ settings, onUpdate }: AccountSectionProps) => (
  <AccountTab 
    settings={settings} 
    onUpdate={async (data: Partial<AccountSettings>) => {
      const result = await onUpdate(data);
      return result === true;
    }} 
  />
));
// FIX: Add Display Name
AccountSection.displayName = 'AccountSection';

interface NotificationSectionProps {
  settings: NotificationSettings;
  onUpdate: (data: Partial<NotificationSettings>) => Promise<boolean>;
}

const NotificationSection = memo(({ settings, onUpdate }: NotificationSectionProps) => (
  <NotificationTab settings={settings} onUpdate={onUpdate} />
));
// FIX: Add Display Name
NotificationSection.displayName = 'NotificationSection';

// --- Main Layout Component ---

export default function SettingsLayout() {
  const { 
    settings, loading, error, saving, 
    updateProfile, uploadAvatar, 
    updateAppearance, updateNotifications, updateAccount 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<string>('profile');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.textSecondary }}>Loading settings...</div>;
  if (error || !settings) return <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.error }}>{error}</div>;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'account', label: 'Account', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: theme.colors.textMain, margin: 0 }}>Settings</h1>
        <p style={{ color: theme.colors.textSecondary, marginTop: '8px' }}>Manage your account preferences and personal details.</p>
      </div>

      <div style={{ 
        display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', 
        marginBottom: '24px', borderBottom: `1px solid ${theme.colors.border}`,
        scrollbarWidth: 'none'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: theme.borderRadius.md,
                border: 'none', backgroundColor: isActive ? theme.colors.bgSurface : 'transparent',
                color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                fontWeight: isActive ? 700 : 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        
        {activeTab === 'profile' && (
          <ProfileSection 
            profile={settings.profile}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
            saving={saving}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceSection 
            settings={settings.appearance} 
            onUpdate={updateAppearance} 
          />
        )}

        {activeTab === 'account' && (
          <AccountSection 
            settings={settings.account} 
            onUpdate={updateAccount} 
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab />
        )}

        {activeTab === 'notifications' && (
          <NotificationSection 
            settings={settings.notifications} 
            onUpdate={updateNotifications} 
          />
        )}
      </div>
    </div>
  );
}
