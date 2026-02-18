import React from 'react';
import ClassCard from './ClassCard';
import SectionHeader from './SectionHeader';
import { useLiveClasses } from '../hooks/useLiveClasses';
import { theme } from '@/styles/theme';

function UpcomingClasses() {
  const { upcomingClasses, loading } = useLiveClasses();

  const gridStyle = `
    .upcoming-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .upcoming-grid { grid-template-columns: 1fr 1fr; } }
  `;

  if (loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <style>{gridStyle}</style>
        <div style={{ height: '24px', width: '150px', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '20px' }} />
        <div className="upcoming-grid">
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

  if (upcomingClasses.length === 0) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <SectionHeader title="Upcoming Classes" />
        <div style={{
          backgroundColor: theme.colors.bgSurface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: '24px',
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontStyle: 'italic'
        }}>
          No upcoming classes scheduled
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{gridStyle}</style>
      <SectionHeader title="Upcoming Classes" />
      <div className="upcoming-grid">
        {upcomingClasses.map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const timeStr = scheduledAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name || 'Instructor'}
              time={timeStr}
              status="Upcoming"
            />
          );
        })}
      </div>
    </div>
  );
}

export default UpcomingClasses;
