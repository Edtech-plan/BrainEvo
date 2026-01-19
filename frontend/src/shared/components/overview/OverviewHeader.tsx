import React from 'react';
import { theme } from '../ui/theme';

export default function OverviewHeader() {
  return (
    <div>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: 700, 
        color: theme.colors.textMain, 
        marginBottom: '4px',
        margin: 0
      }}>
        Dashboard Overview
      </h1>
      <p style={{ 
        color: theme.colors.textSecondary, 
        margin: 0,
        fontSize: '14px'
      }}>
        Welcome back. Here is what is happening with your learning today.
      </p>
    </div>
  );
}
