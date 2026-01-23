import React, { useMemo } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { useLiveClasses } from '@/features/live-classes';

export default function ClassSnapshot() {
  const { upcomingClasses } = useLiveClasses(); // eslint-disable-line @typescript-eslint/no-unused-vars

  const nextClass = useMemo(() => {
    if (upcomingClasses.length === 0) return null;
    return upcomingClasses[0];
  }, [upcomingClasses]);

  const cardStyle = {
    backgroundColor: theme.colors.bgSurface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: theme.shadows.sm,
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${theme.colors.bgMain}`,
    fontSize: '14px',
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: '18px', width: '60%', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ flexGrow: 1, marginTop: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ ...rowStyle, height: '14px', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '16px', margin: 0 }}>Current Batch</h2>
      <div style={{ flexGrow: 1, marginTop: '16px' }}>
        {nextClass ? (
          <>
            <div style={rowStyle}>
              <span style={{ color: theme.colors.textSecondary }}>Course</span>
              <span style={{ fontWeight: 600, color: theme.colors.textMain }}>{nextClass.title}</span>
            </div>
            {nextClass.instructor && (
              <div style={rowStyle}>
                <span style={{ color: theme.colors.textSecondary }}>Instructor</span>
                <span style={{ fontWeight: 600, color: theme.colors.textMain }}>{nextClass.instructor.name}</span>
              </div>
            )}
            <div style={{ ...rowStyle, borderBottom: 'none' }}>
              <span style={{ color: theme.colors.textSecondary }}>Next Class</span>
              <span style={{ color: theme.colors.primary, fontWeight: 600 }}>
                {new Date(nextClass.scheduledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </>
        ) : (
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', fontStyle: 'italic' }}>
            No upcoming classes scheduled
          </div>
        )}
      </div>
      <button style={{
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: 'transparent',
        fontWeight: 600,
        color: theme.colors.textSecondary,
        cursor: 'pointer'
      }}>View Course Details</button>
    </div>
  );
}
