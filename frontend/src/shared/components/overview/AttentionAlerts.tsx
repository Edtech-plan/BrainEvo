import React from 'react';
import { theme } from '../ui/theme';

export default function AttentionAlerts() {
  const alerts = ['You missed 1 assignment', 'Live class in 30 mins'];

  return (
    <div style={{
      backgroundColor: theme.colors.errorBg,
      border: `1px solid #fecaca`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      height: '100%'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b', marginBottom: '16px' }}>Attention Needed</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {alerts.map((a, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', color: '#b91c1c', fontSize: '14px', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>•</span> {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
