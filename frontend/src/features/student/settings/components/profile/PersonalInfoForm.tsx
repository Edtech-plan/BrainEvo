import React, { useState } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { StudentProfile } from '@/shared/types/settings.types';

interface PersonalInfoProps {
  profile: StudentProfile;
  onSave: (data: Partial<StudentProfile>) => Promise<boolean>;
}

export default function PersonalInfoForm({ profile, onSave }: PersonalInfoProps) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    phone: profile.phone,
    headline: profile.headline || ''
  });
  const [saving, setSaving] = useState(false);

  // CHANGED: Simple function, no event object needed
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`, fontSize: '14px',
    backgroundColor: theme.colors.bgMain, color: theme.colors.textMain, marginTop: '6px'
  };

  return (
    // CHANGED: Replaced <form> with <div> to prevent accidental reloads
    <div style={{ 
      backgroundColor: theme.colors.bgSurface, padding: '24px', 
      borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`,
      marginBottom: '24px' 
    }}>
      <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: theme.colors.textMain }}>Personal Information</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label htmlFor="fullName" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>Full Name</label>
          <input 
            id="fullName"
            type="text" value={form.fullName}
            onChange={e => setForm({...form, fullName: e.target.value})}
            style={inputStyle} 
          />
        </div>
        <div>
          <label htmlFor="phone" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>Phone Number</label>
          <input 
            id="phone"
            type="tel" value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
            style={inputStyle} 
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="headline" style={{ fontSize: '13px', fontWeight: 600, color: theme.colors.textSecondary }}>Professional Headline</label>
          <input 
            id="headline"
            type="text" value={form.headline} placeholder="e.g. Frontend Enthusiast"
            onChange={e => setForm({...form, headline: e.target.value})}
            style={inputStyle} 
          />
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        {/* CHANGED: type="button" and explicit onClick handler */}
        <button 
          type="button" 
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 24px', backgroundColor: theme.colors.primary, color: '#fff',
            border: 'none', borderRadius: theme.borderRadius.md, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
