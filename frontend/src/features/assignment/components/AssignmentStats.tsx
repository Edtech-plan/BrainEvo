import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Assignment } from '../../../shared/types/assignment.types';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  assignments: Assignment[];
}

export default function AssignmentStats({ assignments }: Props) {
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
    /* One single container with internal dividers */
    .stats-container {
      display: flex;
      background-color: ${theme.colors.bgSurface};
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.borderRadius.lg};
      overflow: hidden; /* For border radius */
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

    /* Hide the big icon background on mobile to save space */
    .icon-wrapper {
      display: none;
    }
    
    /* Show a small icon inline on mobile */
    .mobile-icon {
      display: block;
      margin-bottom: 6px;
    }

    /* --- DESKTOP VIEW (Min-width: 768px) --- */
    /* Switch back to 3 separate Grid Cards */
    @media (min-width: 768px) {
      .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        /* Reset container styles to be invisible */
        background-color: transparent;
        border: none;
        border-radius: 0;
        overflow: visible;
      }

      .stat-card {
        /* Restore Card Look */
        background-color: ${theme.colors.bgSurface};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.lg};
        padding: 20px;
        
        display: flex;
        flex-direction: row; /* Icon on right */
        align-items: center;
        justify-content: space-between;
        text-align: left;
        box-shadow: ${theme.shadows.sm};
      }

      .stat-card:last-child {
        border-right: 1px solid ${theme.colors.border}; /* Restore border */
      }

      /* Show the desktop icon wrapper */
      .icon-wrapper {
        display: flex;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        align-items: center;
        justify-content: center;
      }

      /* Hide the mobile small icon */
      .mobile-icon {
        display: none;
      }
    }
  `;

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{css}</style>
      <div className="stats-container">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            
            {/* Mobile Only Icon (Small & Centered) */}
            <div className="mobile-icon">
               {stat.icon}
            </div>

            <div>
              <p style={{ 
                margin: 0, 
                fontSize: '11px', 
                fontWeight: 700, 
                color: theme.colors.textSecondary, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}>
                {stat.label}
              </p>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '24px', 
                fontWeight: 800, 
                color: theme.colors.textMain,
                lineHeight: 1
              }}>
                {stat.value}
              </p>
            </div>

            {/* Desktop Only Icon (Big & Colored Box) */}
            <div className="icon-wrapper" style={{
              backgroundColor: stat.bg,
              border: `1px solid ${stat.border}`
            }}>
              {stat.icon}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
