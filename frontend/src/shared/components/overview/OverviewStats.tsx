import React from 'react';
import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';
import { theme } from '../ui/theme';

export default function OverviewStats() {
  const stats = [
    { label: 'Attendance', value: '92%', icon: <Clock size={24} color={theme.colors.success} />, bg: theme.colors.successBg },
    { label: 'Live Classes', value: '18 / 20', icon: <BookOpen size={24} color={theme.colors.primary} />, bg: theme.colors.primaryLight },
    { label: 'Assignments', value: '85%', icon: <Award size={24} color={theme.colors.warning} />, bg: theme.colors.warningBg },
    { label: 'Performance', value: '88%', icon: <TrendingUp size={24} color={theme.colors.info} />, bg: theme.colors.infoBg },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} style={{
          backgroundColor: theme.colors.bgSurface,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start'
        }}>
          <div>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '4px' }}>{s.label}</p>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.textMain }}>{s.value}</h3>
          </div>
          <div style={{ backgroundColor: s.bg, padding: '10px', borderRadius: theme.borderRadius.md }}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
