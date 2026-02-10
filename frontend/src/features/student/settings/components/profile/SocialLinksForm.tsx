import React, { useState } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { StudentProfile } from '@/shared/types/settings.types';
import { Globe, Linkedin } from 'lucide-react';

interface SocialLinksProps {
  links: StudentProfile['socialLinks'];
  onSave: (data: { socialLinks: StudentProfile['socialLinks'] }) => Promise<boolean>;
}

export default function SocialLinksForm({ links, onSave }: SocialLinksProps) {
  const [form, setForm] = useState({
    linkedin: links.linkedin,
    portfolio: links.portfolio
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ 
      socialLinks: {
        linkedin: form.linkedin,
        portfolio: form.portfolio
      }
    });
    setSaving(false);
  };

  const rowStyle = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' };
  const inputStyle = {
    flex: 1, padding: '10px', borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`, fontSize: '14px',
    backgroundColor: theme.colors.bgMain
  };

  return (
    <div style={{ 
      backgroundColor: theme.colors.bgSurface, padding: '24px', 
      borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` 
    }}>
      <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: theme.colors.textMain }}>Online Presence</h4>
      
      <div style={rowStyle}>
        <Linkedin size={20} color={theme.colors.textSecondary} />
        <input 
          placeholder="LinkedIn Profile URL"
          value={form.linkedin}
          onChange={e => setForm({...form, linkedin: e.target.value})}
          style={inputStyle} 
        />
      </div>

      <div style={rowStyle}>
        <Globe size={20} color={theme.colors.textSecondary} />
        <input 
          placeholder="Portfolio / Personal Website"
          value={form.portfolio}
          onChange={e => setForm({...form, portfolio: e.target.value})}
          style={inputStyle} 
        />
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button 
          onClick={handleSave} disabled={saving}
          style={{
            padding: '10px 24px', backgroundColor: theme.colors.primary, color: '#fff',
            border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>
          {saving ? 'Saving...' : 'Update Links'}
        </button>
      </div>
    </div>
  );
}
