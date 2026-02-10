import React from 'react';
import { theme } from '../../../../shared/components/ui/theme';

export const WelcomeHeader = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: theme.colors.textMain }}>Teacher Dashboard</h1>
      <p className="mt-1 text-sm font-medium" style={{ color: theme.colors.textSecondary }}>{today}</p>
    </div>
  );
};
