import React from 'react';
import { theme } from '../ui/theme';

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties; // Added to allow width customization
}

export default function ActionButton({ label, onClick, disabled, style }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', // Default to full width (can be overridden)
        padding: '10px 20px',
        backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
        color: '#fff',
        borderRadius: theme.borderRadius.md,
        fontWeight: 600,
        fontSize: '14px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s, transform 0.1s',
        opacity: disabled ? 0.7 : 1,
        whiteSpace: 'nowrap',
        ...style, // Allow overrides
      }}
      onMouseEnter={(e) => { if(!disabled) e.currentTarget.style.backgroundColor = theme.colors.primaryDark; }}
      onMouseLeave={(e) => { if(!disabled) e.currentTarget.style.backgroundColor = theme.colors.primary; }}
    >
      {label}
    </button>
  );
}
