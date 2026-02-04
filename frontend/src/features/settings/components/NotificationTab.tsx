import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { NotificationSettings, NotificationChannel } from '@/shared/types/settings.types';

interface NotificationtabProps {
  settings: NotificationSettings;
  onUpdate: (data: Partial<NotificationSettings>) => void;
}

export default function NotificationTab({ settings, onUpdate }: NotificationtabProps) {
  
  const ToggleRow = ({ label, channelKey }: { label: string, channelKey: keyof NotificationSettings }) => {
    // Cast strict type
    const channel = settings[channelKey] as NotificationChannel;
    
    const handleToggle = (type: 'email' | 'inApp') => {
      onUpdate({ 
        [channelKey]: { ...channel, [type]: !channel[type] } 
      });
    };

    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '20px', borderBottom: `1px solid ${theme.colors.border}` 
      }}>
        <span style={{ fontWeight: 600, color: theme.colors.textMain }}>{label}</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={channel.email} onChange={() => handleToggle('email')} />
            <span style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Email</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={channel.inApp} onChange={() => handleToggle('inApp')} />
            <span style={{ fontSize: '14px', color: theme.colors.textSecondary }}>In-App</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` }}>
      <div style={{ padding: '20px', borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgMain }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: theme.colors.textMain }}>Alert Preferences</h3>
      </div>
      
      <ToggleRow label="New Assignments" channelKey="assignmentCreated" />
      <ToggleRow label="Grades & Feedback" channelKey="gradeReleased" />
      <ToggleRow label="Live Class Reminders" channelKey="liveClassReminders" />
      <ToggleRow label="General Announcements" channelKey="announcements" />
      
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ display: 'block', fontWeight: 600, color: theme.colors.textMain }}>Quiet Hours</span>
          <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>Mute notifications between 10 PM and 8 AM</span>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={settings.quietHours.enabled} 
            onChange={() => onUpdate({ quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled } })} 
          />
          <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 600, color: settings.quietHours.enabled ? theme.colors.primary : theme.colors.textSecondary }}>
            {settings.quietHours.enabled ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>
    </div>
  );
}
