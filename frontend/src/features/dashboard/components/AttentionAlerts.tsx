import React, { useMemo } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { useAssignments } from '@/shared/hooks/useAssignments';
import { useLiveClasses } from '@/features/live-classes';

export default function AttentionAlerts() {
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { liveClasses, loading: classesLoading } = useLiveClasses();

  const alerts = useMemo(() => {
    const alertList: string[] = [];
    const now = new Date();

    // Check for missed assignment deadlines
    const missedAssignments = assignments.filter((assignment) => {
      if (!assignment.dueDate) return false;
      const dueDate = new Date(assignment.dueDate);
      return dueDate < now;
    });

    if (missedAssignments.length > 0) {
      alertList.push(`You missed ${missedAssignments.length} assignment deadline${missedAssignments.length > 1 ? 's' : ''}`);
    }

    // Check for upcoming live classes (within 30 minutes)
    const upcomingSoon = liveClasses.filter((liveClass) => {
      const scheduledAt = new Date(liveClass.scheduledAt);
      const timeDiff = scheduledAt.getTime() - now.getTime();
      return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // Within 30 minutes
    });

    upcomingSoon.forEach((liveClass) => {
      const scheduledAt = new Date(liveClass.scheduledAt);
      const minutesUntil = Math.round((scheduledAt.getTime() - now.getTime()) / (60 * 1000));
      alertList.push(`Live class "${liveClass.title}" in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`);
    });

    return alertList;
  }, [assignments, liveClasses]);

  const loading = assignmentsLoading || classesLoading;

  if (loading) {
    return (
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: '24px',
        height: '100%'
      }}>
        <div style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>Loading alerts...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div style={{
        backgroundColor: theme.colors.successBg,
        border: `1px solid ${theme.colors.success}20`,
        borderRadius: theme.borderRadius.lg,
        padding: '24px',
        height: '100%'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.successText, marginBottom: '16px', margin: 0 }}>All Good!</h2>
        <p style={{ color: theme.colors.successText, fontSize: '14px', margin: 0 }}>No attention needed at this time.</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme.colors.errorBg,
      border: `1px solid ${theme.colors.error}20`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      height: '100%'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b', marginBottom: '16px', margin: 0 }}>Attention Needed</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: '16px' }}>
        {alerts.map((a, i) => (
          <li key={i} style={{ display: 'flex', gap: '8px', color: '#b91c1c', fontSize: '14px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 'bold', color: theme.colors.error }}>•</span> {a}
          </li>
        ))}
      </ul>
    </div>
  );
}
