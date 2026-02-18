import React from 'react';
import ClassCard from './ClassCard';
import SectionHeader from './SectionHeader';
import { useLiveClasses } from '../hooks/useLiveClasses';
import { theme } from '@/styles/theme';

function TodayClasses() {
  const { todayClasses, loading } = useLiveClasses();

  const gridStyle = `
    .today-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .today-grid { grid-template-columns: 1fr 1fr; } }
  `;

  if (loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <style>{gridStyle}</style>
        <div style={{ height: '24px', width: '150px', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '20px' }} />
        <div className="today-grid">
          {[1, 2].map((i) => (
            <div key={i} style={{
              backgroundColor: theme.colors.bgSurface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.lg,
              padding: '24px',
              minHeight: '200px'
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (todayClasses.length === 0) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <SectionHeader title="Today's Classes" />
        <div style={{
          backgroundColor: theme.colors.bgSurface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: '24px',
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontStyle: 'italic'
        }}>
          No classes scheduled for today
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{gridStyle}</style>
      <SectionHeader title="Today's Classes" />
      <div className="today-grid">
        {todayClasses.map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const endTime = new Date(scheduledAt.getTime() + (liveClass.duration || 60) * 60 * 1000);
          const timeStr = `${scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name || 'Instructor'}
              time={timeStr}
            >
              <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Scheduled</div>
            </ClassCard>
          );
        })}
      </div>
    </div>
  );
}

export default TodayClasses;
