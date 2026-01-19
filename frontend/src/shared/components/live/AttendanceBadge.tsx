import React from 'react';
import { theme } from '../ui/theme';

interface AttendanceBadgeProps {
  status: 'Present' | 'Late' | 'Absent';
}

export default function AttendanceBadge({ status }: AttendanceBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'Present': return { bg: theme.colors.successBg, text: theme.colors.success, border: '#6ee7b7' }; // Green
      case 'Late': return { bg: theme.colors.warningBg, text: '#d97706', border: '#fcd34d' }; // Yellow/Amber
      case 'Absent': return { bg: theme.colors.errorBg, text: theme.colors.error, border: '#fca5a5' }; // Red
      default: return { bg: theme.colors.bgHover, text: theme.colors.textSecondary, border: theme.colors.border };
    }
  };

  const style = getStyles();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: theme.borderRadius.full,
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      fontSize: '12px',
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}
