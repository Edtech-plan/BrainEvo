import React from 'react';
import { theme } from '../ui/theme';

interface ClassCardProps {
  title: string;
  teacher: string;
  time: string;
  status?: string;
  children?: React.ReactNode;
}

export default function ClassCard({ title, teacher, time, status, children }: ClassCardProps) {
  return (
    <div style={{
      backgroundColor: theme.colors.bgSurface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      boxShadow: theme.shadows.sm,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.colors.border}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, margin: 0, lineHeight: 1.2 }}>{title}</h3>
        {status && (
          <span style={{
            fontSize: '12px', fontWeight: 600, padding: '4px 10px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: status === 'Live Now' ? '#fee2e2' : theme.colors.bgHover,
            color: status === 'Live Now' ? theme.colors.error : theme.colors.textSecondary,
            border: `1px solid ${status === 'Live Now' ? '#fecaca' : theme.colors.border}`,
            whiteSpace: 'nowrap'
          }}>
            {status}
          </span>
        )}
      </div>

      <div style={{ marginBottom: 'auto' }}>
        <p style={{ fontSize: '14px', color: theme.colors.textSecondary, margin: '0 0 4px 0' }}>
          <span style={{ fontWeight: 600, color: theme.colors.textMain }}>Instructor: </span>{teacher}
        </p>
        <p style={{ fontSize: '14px', color: theme.colors.textSecondary, margin: 0 }}>
          <span style={{ fontWeight: 600, color: theme.colors.textMain }}>Time: </span>{time}
        </p>
      </div>

      {children && <div style={{ marginTop: '20px' }}>{children}</div>}
    </div>
  );
}
