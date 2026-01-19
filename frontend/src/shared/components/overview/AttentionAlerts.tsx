import React from 'react';
import { theme } from '../ui/theme';

export default function AttentionAlerts() {
  const alerts = ['You missed 1 assignment deadline', 'Live class on React Hooks in 30 mins'];

  return (
    <div style={{
      backgroundColor: theme.colors.errorBg,
      border: `1px solid ${theme.colors.error}20`, // low opacity red border
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      height: '100%'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b', marginBottom: '16px', margin: 0 }}>Attention Needed</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: '16px' }}>
        {alerts.map((a, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', color: '#b91c1c', fontSize: '14px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 'bold', color: theme.colors.error }}>•</span> {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
