import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import AttendanceBadge from '@/shared/components/live/AttendanceBadge';
import ClassCard from '@/shared/components/live/ClassCard';
import SectionHeader from '@/shared/components/live/SectionHeader';
import { useLiveClasses } from '../hooks/useLiveClasses';

function PastClasses() {
  const { pastClasses, loading } = useLiveClasses();

  const gridStyle = `
    .past-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .past-grid { grid-template-columns: 1fr 1fr; } }
  `;

  if (loading) {
    return (
      <div>
        <style>{gridStyle}</style>
        <div style={{ height: '24px', width: '150px', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '20px' }} />
        <div className="past-grid">
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

  if (pastClasses.length === 0) {
    return (
      <div>
        <SectionHeader title="Past Classes" />
        <div style={{
          backgroundColor: theme.colors.bgSurface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: '24px',
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontStyle: 'italic'
        }}>
          No past classes to display
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{gridStyle}</style>
      <SectionHeader title="Past Classes" />
      <div className="past-grid">
        {pastClasses.slice(0, 6).map((liveClass) => {
          const scheduledAt = new Date(liveClass.scheduledAt);
          const timeStr = scheduledAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          // For past classes, we'll show a default attendance status
          // In a real app, this would come from the backend
          const attendance: 'Present' | 'Late' | 'Absent' = 'Present';

          return (
            <ClassCard
              key={liveClass.id}
              title={liveClass.title}
              teacher={liveClass.instructor?.name || 'Instructor'}
              time={timeStr}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <AttendanceBadge status={attendance} />
              </div>
            </ClassCard>
          );
        })}
      </div>
    </div>
  );
}

export default PastClasses;
