import React, { useMemo } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { useLiveClasses } from '@/features/student/live-classes';
import { useAssignments } from '@/features/student/assignment/hooks/useAssignments';

export default function UpcomingSchedule() {
  const { liveClasses, loading: classesLoading } = useLiveClasses();
  const { assignments, loading: assignmentsLoading } = useAssignments();

  const upcomingEvents = useMemo(() => {
    const events: Array<{ title: string; time: string; type: 'class' | 'deadline' }> = [];
    const now = new Date();

    // Add upcoming live classes (next 7 days)
    liveClasses.forEach((liveClass) => {
      const scheduledAt = new Date(liveClass.scheduledAt);
      if (scheduledAt > now && scheduledAt.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        const isToday = scheduledAt.toDateString() === now.toDateString();
        events.push({
          title: `Live Class: ${liveClass.title}`,
          time: isToday
            ? `Today, ${scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
            : scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
          type: 'class'
        });
      }
    });

    // Add assignment deadlines (next 7 days)
    assignments.forEach((assignment) => {
      if (assignment.dueDate) {
        const dueDate = new Date(assignment.dueDate);
        if (dueDate > now && dueDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
          const isToday = dueDate.toDateString() === now.toDateString();
          const isTomorrow = dueDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
          events.push({
            title: `Assignment: ${assignment.title}`,
            time: isToday
              ? `Today, ${dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
              : isTomorrow
              ? `Tomorrow, ${dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
              : dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
            type: 'deadline'
          });
        }
      }
    });

    // Sort by time
    return events.sort((a, b) => {
      const timeA = a.time.includes('Today') ? 0 : a.time.includes('Tomorrow') ? 1 : 2;
      const timeB = b.time.includes('Today') ? 0 : b.time.includes('Tomorrow') ? 1 : 2;
      return timeA - timeB;
    }).slice(0, 5); // Limit to 5 events
  }, [liveClasses, assignments]);

  const loading = classesLoading || assignmentsLoading;

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
        {loading ? (
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', fontStyle: 'italic' }}>Loading schedule...</div>
        ) : upcomingEvents.length === 0 ? (
          <div style={{ color: theme.colors.textSecondary, fontSize: '14px', fontStyle: 'italic' }}>No upcoming events</div>
        ) : (
          upcomingEvents.map((e, i) => (
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
          ))
        )}
      </div>
    </div>
  );
}
