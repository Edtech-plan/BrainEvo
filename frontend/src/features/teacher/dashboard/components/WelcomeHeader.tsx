import React from 'react';
import { theme } from '../../../../shared/components/ui/theme';

interface WelcomeHeaderProps {
  username: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mb-8">
      <h1 
        className="text-3xl font-bold tracking-tight"
        style={{ color: theme.colors.textMain }}
      >
        Welcome back, {username}!
      </h1>
      <div 
        className="flex items-center mt-2 space-x-2 text-sm font-medium"
        style={{ color: theme.colors.textSecondary }}
      >
        <span>{today}</span>
      </div>
    </div>
  );
};
