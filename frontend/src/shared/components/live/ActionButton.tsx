// ActionButton.tsx
import React from 'react';
import { theme } from '@/shared/components/ui/theme';

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

function ActionButton({ label, onClick, disabled, variant = 'primary' }: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 16px',
        borderRadius: theme.borderRadius.md,
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: isPrimary ? 'none' : `1px solid ${theme.colors.border}`,
        backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
        color: isPrimary ? '#fff' : theme.colors.textMain,
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default ActionButton;
