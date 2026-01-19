import React from 'react';
import { theme } from '../ui/theme';

export default function PerformanceSnapshot() {
  return (
    <div style={{
      backgroundColor: theme.colors.bgSurface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      boxShadow: theme.shadows.sm,
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '24px', margin: 0 }}>Performance Snapshot</h2>

      <div style={{ marginBottom: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>On-time Submissions</span>
          <span style={{ color: theme.colors.textMain, fontWeight: '700' }}>90%</span>
        </div>
        <div style={{ height: '8px', width: '100%', backgroundColor: theme.colors.bgHover, borderRadius: theme.borderRadius.full, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '90%', backgroundColor: theme.colors.success, borderRadius: theme.borderRadius.full }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{
          backgroundColor: theme.colors.bgMain, borderRadius: theme.borderRadius.md,
          padding: '16px', textAlign: 'center', border: `1px solid ${theme.colors.border}`
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.textMain }}>1</div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: theme.colors.textSecondary, fontWeight: 600, marginTop: '4px' }}>Missed Deadlines</div>
        </div>
        <div style={{
          backgroundColor: theme.colors.successBg, borderRadius: theme.borderRadius.md,
          padding: '16px', textAlign: 'center', border: '1px solid #d1fae5'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#047857' }}>Up</div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Attendance Trend</div>
        </div>
      </div>
    </div>
  );
}
