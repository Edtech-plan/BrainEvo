import React from 'react';
import { theme } from '@/styles/theme';
import { AppearanceSettings, ThemeMode, EditorKeymap } from '@/shared/types/settings.types';
import { Moon, Sun, Monitor } from 'lucide-react';

interface AppearanceTabProps {
  settings: AppearanceSettings;
  onUpdate: (data: Partial<AppearanceSettings>) => void;
}

export default function AppearanceTab({ settings, onUpdate }: AppearanceTabProps) {
  return (
    <div style={{ maxWidth: '800px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '16px' }}>Interface Theme</h3>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => {
          const isActive = settings.theme === mode;
          const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
          return (
            <button 
              key={mode}
              onClick={() => onUpdate({ theme: mode })}
              style={{
                flex: 1, padding: '20px', borderRadius: theme.borderRadius.lg,
                border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
                backgroundColor: isActive ? theme.colors.primaryLight : theme.colors.bgSurface,
                cursor: 'pointer', textAlign: 'center'
              }}>
              <Icon size={24} color={isActive ? theme.colors.primary : theme.colors.textSecondary} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? theme.colors.primary : theme.colors.textMain, textTransform: 'capitalize' }}>{mode}</div>
            </button>
          );
        })}
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '16px' }}>Editor Preferences</h3>
      <div style={{ backgroundColor: theme.colors.bgSurface, padding: '24px', borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}` }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: theme.colors.textMain }}>
            Font Size ({settings.editorFontSize}px)
          </label>
          <input 
            type="range" min="12" max="24" step="2"
            value={settings.editorFontSize}
            onChange={(e) => onUpdate({ editorFontSize: parseInt(e.target.value, 10) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>
        <div>
          <label htmlFor="keybinding-select" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: theme.colors.textMain }}>Keybinding Mode</label>
          <select 
            id="keybinding-select"
            value={settings.editorKeymap}
            onChange={(e) => onUpdate({ editorKeymap: e.target.value as EditorKeymap })}
            style={{ 
              width: '100%', padding: '10px', borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgMain 
            }}
          >
            <option value="vscode">VS Code (Standard)</option>
            <option value="vim">Vim</option>
            <option value="sublime">Sublime Text</option>
          </select>
        </div>
      </div>
    </div>
  );
}
