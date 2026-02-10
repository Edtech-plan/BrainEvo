import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Assignment } from '@/shared/types/assignment.types'; // Fixed Import Path
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

// Fix: Exported Interface & Added loading prop
export interface AssignmentStatsProps {
  assignments: Assignment[];
  loading?: boolean;
}

export default function AssignmentStats({ assignments, loading }: AssignmentStatsProps) {
  // Fix: Render Skeleton if loading
  if (loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        {/* Simple Grid Skeleton that fits both mobile/desktop layout spaces reasonably well */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: '100px',
              backgroundColor: theme.colors.bgSurface,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              opacity: 0.5
            }} />
          ))}
        </div>
      </div>
    );
  }

  const pending = assignments.filter(a => a.status === 'PENDING').length;
  const overdue = assignments.filter(a => a.status === 'OVERDUE').length;
  const completed = assignments.filter(a => a.status === 'GRADED' || a.status === 'SUBMITTED').length;

  const statCards = [
    { label: 'Due Soon', value: pending, icon: <Clock size={18} color={theme.colors.primary} />, bg: theme.colors.primaryLight, border: '#bfdbfe' },
    { label: 'Missed', value: overdue, icon: <AlertCircle size={18} color={theme.colors.error} />, bg: theme.colors.errorBg, border: '#fecaca' },
    { label: 'Completed', value: completed, icon: <CheckCircle2 size={18} color={theme.colors.success} />, bg: theme.colors.successBg, border: '#bbf7d0' },
  ];

  const css = `
    /* --- MOBILE VIEW (Default) --- */
    .stats-container {
      display: flex;
      background-color: ${theme.colors.bgSurface};
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.borderRadius.lg};
      overflow: hidden;
    }

    .stat-card {
      flex: 1;
      padding: 16px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-right: 1px solid ${theme.colors.bgMain};
    }

    .stat-card:last-child {
      border-right: none;
    }

    .icon-wrapper { display: none; }
    
    .mobile-icon {
      display: block;
      margin-bottom: 6px;
    }

    /* --- DESKTOP VIEW (Min-width: 768px) --- */
    @media (min-width: 768px) {
      .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        background-color: transparent;
        border: none;
        border-radius: 0;
        overflow: visible;
      }

      .stat-card {
        background-color: ${theme.colors.bgSurface};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.lg};
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        box-shadow: ${theme.shadows.sm};
      }

      .stat-card:last-child {
        border-right: 1px solid ${theme.colors.border};
      }

      .icon-wrapper {
        display: flex;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        align-items: center;
        justify-content: center;
      }

      .mobile-icon { display: none; }
    }
  `;

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{css}</style>
      <div className="stats-container">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="mobile-icon">{stat.icon}</div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                {stat.label}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 800, color: theme.colors.textMain, lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
            <div className="icon-wrapper" style={{ backgroundColor: stat.bg, border: `1px solid ${stat.border}` }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
