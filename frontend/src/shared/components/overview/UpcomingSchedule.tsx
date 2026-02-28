import React from 'react';
import { theme } from '../../../../styles/theme';

export default function UpcomingSchedule() {
  const events = [
    { title: 'Live Class: React Hooks', time: 'Today, 6:00 PM', type: 'class' },
    { title: 'Assignment Deadline', time: 'Tomorrow, 11:59 PM', type: 'deadline' },
  ];

  return (
    <div style={{
      backgroundColor: theme.colors.bgSurface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: theme.shadows.sm,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, margin: 0 }}>Upcoming Schedule</h2>
        <button style={{ color: theme.colors.primary, border: 'none', background: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>View All</button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '8px', height: '8px', borderRadius: '50%', 
              backgroundColor: e.type === 'deadline' ? theme.colors.error : theme.colors.primary, 
              marginTop: '6px', flexShrink: 0
            }} />
            <div>
              <p style={{ fontWeight: 500, fontSize: '14px', margin: 0, color: theme.colors.textMain }}>{e.title}</p>
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary, margin: 0, marginTop: '2px' }}>{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
