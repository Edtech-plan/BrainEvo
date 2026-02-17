import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { theme } from '@/shared/components/ui/theme';
import { AccountSettings } from '@/shared/types/settings.types';
import { Globe, Clock, LogOut } from 'lucide-react';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'; // Import Shared Modal
import { useAuth } from '@/features/auth/hooks/useAuth';

interface AccountTabProps {
  settings: AccountSettings;
  onUpdate: (data: Partial<AccountSettings>) => Promise<boolean>;
}

export default function AccountTab({ settings, onUpdate }: AccountTabProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  
  // Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [formData, setFormData] = useState({
    language: settings.language,
    timezone: settings.timezone
  });

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(formData);
    setLoading(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push('/login');
  };

  const labelStyle = { 
    display: 'block', marginBottom: '8px', fontSize: '13px', 
    fontWeight: 600, color: theme.colors.textSecondary 
  };
  
  const selectStyle = {
    width: '100%', padding: '10px', borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgMain,
    color: theme.colors.textMain, fontSize: '14px'
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      
      {/* Confirmation Modal Component */}
      <ConfirmationModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        isDangerous={true}
      />

      <div style={{ 
        backgroundColor: theme.colors.bgSurface, padding: '24px', 
        borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`,
        marginBottom: '24px' 
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700, color: theme.colors.textMain }}>
          Account Preferences
        </h3>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label htmlFor="language" style={labelStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Globe size={14} /> Interface Language
              </div>
            </label>
            <select 
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              style={selectStyle}
            >
              <option value="en">English (US)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" style={labelStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Clock size={14} /> Timezone
              </div>
            </label>
            <select 
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              style={selectStyle}
            >
              <option value="UTC">UTC (Universal Time)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>

          <div style={{ textAlign: 'right', marginTop: '12px' }}>
            <button 
              type="button"
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: '10px 24px', borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.primary, color: '#fff',
                border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="button"
          onClick={() => setShowLogoutModal(true)} // Trigger Modal
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          onFocus={() => setIsLogoutHovered(true)}
          onBlur={() => setIsLogoutHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', borderRadius: theme.borderRadius.md,
            backgroundColor: isLogoutHovered ? '#dc2626' : '#ef4444',
            color: '#fff',
            border: 'none',
            fontWeight: 600, cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s ease',
            outline: 'none',
            boxShadow: theme.shadows.sm
          }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

    </div>
  );
}
