import React from 'react';
import { theme } from './theme';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean; // If true, confirm button is red
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.6)', // Dimmed background
      backdropFilter: 'blur(4px)', // Blur effect
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Modal Card */}
      <div style={{
        backgroundColor: '#fff',
        width: '90%', maxWidth: '400px',
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
        animation: 'scaleIn 0.2s ease-out'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px', borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isDangerous && <AlertTriangle size={20} color={theme.colors.error} />}
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <p style={{ margin: 0, fontSize: '15px', color: theme.colors.textSecondary, lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px', backgroundColor: theme.colors.bgSurface,
          display: 'flex', justifyContent: 'flex-end', gap: '12px',
          borderTop: `1px solid ${theme.colors.border}`
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px', borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: '#fff', color: theme.colors.textMain,
              fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 16px', borderRadius: theme.borderRadius.md,
              border: 'none',
              backgroundColor: isDangerous ? theme.colors.error : theme.colors.primary,
              color: '#fff',
              fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
