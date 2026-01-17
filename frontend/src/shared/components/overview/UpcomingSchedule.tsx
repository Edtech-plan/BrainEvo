import React from 'react';
import { theme } from '../ui/theme';

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
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Upcoming Schedule</h2>
        <button style={{ color: theme.colors.primary, border: 'none', background: 'none', fontWeight: 600, cursor: 'pointer' }}>View All</button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: e.type === 'deadline' ? theme.colors.error : theme.colors.primary, marginTop: '6px' }} />
            <div>
              <p style={{ fontWeight: 500, fontSize: '14px' }}>{e.title}</p>
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary }}>{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
