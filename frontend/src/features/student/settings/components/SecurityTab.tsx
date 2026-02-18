import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import { useSecurity } from '../hooks/useSecurity';
import { Shield, Smartphone, Monitor } from 'lucide-react';

export default function SecurityTab() {
  const { sessions, changePassword, loading: sessionsLoading } = useSecurity();
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passForm.new.length < 8) {
      setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(passForm.current, passForm.new);
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      setPassForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      // safely cast error to string
      setMsg({ type: 'error', text: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgMain, marginTop: '6px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Change Password */}
      <div style={{ backgroundColor: theme.colors.bgSurface, padding: '24px', borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` }}>
        <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.textMain }}>Change Password</h3>
        
        {msg && (
          <div style={{ 
            padding: '12px', marginBottom: '16px', borderRadius: theme.borderRadius.md, fontSize: '14px',
            backgroundColor: msg.type === 'error' ? theme.colors.errorBg : theme.colors.successBg,
            color: msg.type === 'error' ? theme.colors.error : theme.colors.success 
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label htmlFor="currentPassword" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>Current Password</label>
            <input id="currentPassword" type="password" style={inputStyle} value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} required />
          </div>
          <div>
            <label htmlFor="newPassword" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>New Password</label>
            <input id="newPassword" type="password" style={inputStyle} value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} required />
          </div>
          <div>
            <label htmlFor="confirmPassword" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>Confirm Password</label>
            <input id="confirmPassword" type="password" style={inputStyle} value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} required />
          </div>
          <button type="submit" disabled={loading} style={{ 
            padding: '10px', backgroundColor: theme.colors.primary, color: '#fff', border: 'none', 
            borderRadius: theme.borderRadius.md, fontWeight: 600, marginTop: '8px', cursor: 'pointer' 
          }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 2. Login History */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '16px' }}>Login History</h3>
        
        {sessionsLoading ? (
          <div style={{ color: theme.colors.textSecondary }}>Loading sessions...</div>
        ) : (
          <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.lg, overflow: 'hidden' }}>
            {sessions.map((sess, i) => (
              <div key={sess.id} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '16px 20px', backgroundColor: theme.colors.bgSurface,
                borderBottom: i !== sessions.length - 1 ? `1px solid ${theme.colors.border}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '10px', backgroundColor: theme.colors.bgMain, borderRadius: '50%' }}>
                    {sess.device.toLowerCase().includes('phone') ? <Smartphone size={20} /> : <Monitor size={20} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: theme.colors.textMain }}>{sess.device}</div>
                    <div style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
                      {sess.location} • {sess.ipAddress} • {new Date(sess.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {sess.isCurrent && (
                  <span style={{ fontSize: '12px', fontWeight: 700, color: theme.colors.success, backgroundColor: theme.colors.successBg, padding: '4px 8px', borderRadius: '12px' }}>
                    CURRENT
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
