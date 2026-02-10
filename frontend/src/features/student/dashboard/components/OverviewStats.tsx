import React from 'react';
import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';
import { theme } from '@/shared/components/ui/theme';
import { useDashboard } from '../hooks/useDashboard';

export default function OverviewStats() {
  const { dashboardData, loading } = useDashboard();

  // Default stats if data is not available
  const stats = [
    {
      label: 'Attendance',
      value: dashboardData?.attendanceRate ? `${Math.round(dashboardData.attendanceRate)}%` : '--',
      icon: <Clock size={24} color={theme.colors.successText} />,
      bg: theme.colors.successBg
    },
    {
      label: 'Live Classes',
      value: dashboardData ? `${dashboardData.totalEnrollments || 0} / ${dashboardData.totalCourses || 0}` : '-- / --',
      icon: <BookOpen size={24} color={theme.colors.primary} />,
      bg: theme.colors.primaryLight
    },
    {
      label: 'Assignments',
      value: dashboardData?.completionRate ? `${Math.round(dashboardData.completionRate)}%` : '--',
      icon: <Award size={24} color={theme.colors.warningText} />,
      bg: theme.colors.warningBg
    },
    {
      label: 'Performance',
      value: dashboardData?.completionRate ? `${Math.round(dashboardData.completionRate)}%` : '--',
      icon: <TrendingUp size={24} color={theme.colors.infoText} />,
      bg: theme.colors.infoBg
    },
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

  if (loading) {
    return (
      <div className="stats-grid">
        <style>{css}</style>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            backgroundColor: theme.colors.bgSurface,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            boxShadow: theme.shadows.sm,
            minHeight: '100px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                height: '14px',
                width: '60%',
                backgroundColor: theme.colors.bgHover,
                borderRadius: '4px',
                marginBottom: '8px'
              }} />
              <div style={{
                height: '24px',
                width: '40%',
                backgroundColor: theme.colors.bgHover,
                borderRadius: '4px'
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
