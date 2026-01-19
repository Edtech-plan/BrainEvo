// PageHeader.tsx
import React from 'react';
import { theme } from '@/shared/components/ui/theme';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={className} style={{ marginBottom: '32px' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: theme.colors.textMain,
        marginBottom: '8px'
      }}>
        {title}
      </h1>
      {description && (
        <p style={{
          fontSize: '16px',
          color: theme.colors.textSecondary
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default PageHeader;
