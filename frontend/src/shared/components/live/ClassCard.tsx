// ClassCard.tsx
import React from 'react';
import { theme } from '@/shared/components/ui/theme';

interface ClassCardProps {
  title: string;
  teacher: string;
  time: string;
  status?: string;
  children?: React.ReactNode;
  noBorder?: boolean;
}

function ClassCard({ title, teacher, time, status, children, noBorder = false }: ClassCardProps) {
  return (
    <div style={{
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.borderRadius.lg,
      border: noBorder ? 'none' : `1px solid ${theme.colors.border}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.2s', // Keeping transition
      boxShadow: theme.shadows.sm
    }}
    className="hover:-translate-y-1" // Tailwind for hover transform is cleaner than inline state
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: theme.colors.textMain, marginRight: '16px' }}>
          {title}
        </h3>
        {status && (
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.bgMain,
            color: theme.colors.textSecondary,
            border: `1px solid ${theme.colors.border}`,
            whiteSpace: 'nowrap'
          }}>
            {status}
          </span>
        )}
      </div>

      <div style={{ flexGrow: 1, marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
          <span style={{ fontWeight: 500, color: theme.colors.textMain, marginRight: '4px' }}>Instructor:</span>
          {teacher}
        </div>
        <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
          <span style={{ fontWeight: 500, color: theme.colors.textMain, marginRight: '4px' }}>Time:</span>
          {time}
        </div>
      </div>

      {children && <div style={{ marginTop: 'auto' }}>{children}</div>}
    </div>
  );
}

export default ClassCard;
