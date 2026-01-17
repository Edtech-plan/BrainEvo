import React from 'react';
import { theme } from '../ui/theme';

export default function ClassSnapshot() {
  const cardStyle = {
    backgroundColor: theme.colors.bgSurface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.colors.bgMain}`,
    fontSize: '14px',
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '16px' }}>Current Batch</h2>
      <div style={{ flexGrow: 1 }}>
        <div style={rowStyle}>
          <span style={{ color: theme.colors.textSecondary }}>Batch</span>
          <span style={{ fontWeight: 600 }}>Batch A</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: theme.colors.textSecondary }}>Instructor</span>
          <span style={{ fontWeight: 600 }}>John Doe</span>
        </div>
        <div style={rowStyle}>
          <span style={{ color: theme.colors.textSecondary }}>Next Class</span>
          <span style={{ color: theme.colors.primary, fontWeight: 600 }}>Tomorrow, 6:00 PM</span>
        </div>
      </div>
      <button style={{
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: 'transparent',
        fontWeight: 600,
        color: theme.colors.textSecondary,
        cursor: 'pointer'
      }}>View Course Details</button>
    </div>
  );
}
