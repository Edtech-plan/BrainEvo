import React, { useState } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { useSettings } from '../hooks/useSettings';
import { User, Lock, Bell, Palette, Globe } from 'lucide-react';

import { 
  ProfileHeader, PersonalInfoForm, SocialLinksForm,
  AppearanceTab, SecurityTab, NotificationTab, AccountTab
} from './index';

export default function SettingsLayout() {
  const { 
    settings, loading, error, saving, 
    updateProfile, uploadAvatar, 
    updateAppearance, updateNotifications, updateAccount 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState('profile');

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
          <>
            <ProfileHeader 
              profile={settings.profile} 
              onUpdate={(url) => updateProfile({ avatarUrl: url })} 
              onUpload={uploadAvatar}
              isUploading={saving}    
            />
            <PersonalInfoForm 
              profile={settings.profile} 
              onSave={async (data) => {
                const result = await updateProfile(data);
                return result === true;
              }} 
            />
            <SocialLinksForm 
              links={settings.profile.socialLinks} 
              onSave={async (data) => {
                const result = await updateProfile(data);
                return result === true;
              }} 
            />
          </>
        )}

        {activeTab === 'appearance' && (
          <AppearanceTab settings={settings.appearance} onUpdate={updateAppearance} />
        )}

        {activeTab === 'account' && (
          <AccountTab settings={settings.account} onUpdate={async (data) => {
            const result = await updateAccount(data);
            return result === true;
          }} />
        )}

        {activeTab === 'security' && (
          <SecurityTab />
        )}

        {activeTab === 'notifications' && (
          <NotificationTab settings={settings.notifications} onUpdate={updateNotifications} />
        )}
      </div>
    </div>
  );
}
