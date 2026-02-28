import React from 'react';
import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';
import { theme } from '../../../../styles/theme';

export default function OverviewStats() {
  const stats = [
    { label: 'Attendance', value: '92%', icon: <Clock size={24} color={theme.colors.successText} />, bg: theme.colors.successBg },
    { label: 'Live Classes', value: '18 / 20', icon: <BookOpen size={24} color={theme.colors.primary} />, bg: theme.colors.primaryLight },
    { label: 'Assignments', value: '85%', icon: <Award size={24} color={theme.colors.warningText} />, bg: theme.colors.warningBg },
    { label: 'Performance', value: '88%', icon: <TrendingUp size={24} color={theme.colors.infoText} />, bg: theme.colors.infoBg },
  ];

  const css = `
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 640px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
  `;

  return (
    <div className="stats-grid">
      <style>{css}</style>
      {stats.map((s, i) => (
        <div key={i} style={{
          backgroundColor: theme.colors.bgSurface,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          boxShadow: theme.shadows.sm
        }}>
          <div>
            <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginBottom: '4px', margin: 0 }}>{s.label}</p>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.textMain, margin: 0 }}>{s.value}</h3>
          </div>
          <div style={{ backgroundColor: s.bg, padding: '10px', borderRadius: theme.borderRadius.md }}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
