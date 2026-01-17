// AttendanceBadge.tsx
import React from 'react';
import { theme } from '@/shared/components/ui/theme';

interface AttendanceBadgeProps {
  status: 'Present' | 'Late' | 'Absent';
}

function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case 'Present':
        return { bg: theme.colors.successBg, color: theme.colors.success, border: theme.colors.success };
      case 'Late':
        return { bg: theme.colors.warningBg, color: theme.colors.warning, border: theme.colors.warning };
      case 'Absent':
        return { bg: theme.colors.errorBg, color: theme.colors.error, border: theme.colors.error };
      default:
        return { bg: theme.colors.bgSurface, color: theme.colors.textMain, border: theme.colors.border };
    }
  };

  const s = getStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: theme.borderRadius.full,
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}40`
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        marginRight: '6px',
        backgroundColor: s.color
      }} />
      {status}
    </span>
  );
}

export default AttendanceBadge;
