import React from 'react';
import { theme } from '../ui/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, margin: 0 }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginTop: '4px', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
