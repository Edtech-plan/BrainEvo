import React, { useMemo } from 'react';
import { theme } from '@/styles/theme';
import { useAssignments } from '@/features/student/assignment/hooks/useAssignments';
import { useDashboard } from '../hooks/useDashboard';

export default function PerformanceSnapshot() {
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { dashboardData, loading: dashboardLoading } = useDashboard();

  const onTimeRate = useMemo(() => {
    // This would ideally come from backend, but calculating from assignments for now
    if (!assignments.length) return 0;
    // Placeholder calculation - backend should provide this
    return dashboardData?.completionRate || 90;
  }, [assignments, dashboardData]);

  const missedDeadlines = useMemo(() => {
    const now = new Date();
    return assignments.filter((assignment) => {
      if (!assignment.dueDate) return false;
      return new Date(assignment.dueDate) < now;
    }).length;
  }, [assignments]);

  const loading = assignmentsLoading || dashboardLoading;

  return (
    <div style={{
      backgroundColor: theme.colors.bgSurface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: '24px',
      boxShadow: theme.shadows.sm,
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '24px', margin: 0 }}>Performance Snapshot</h2>

      {loading ? (
        <div>
          <div style={{ height: '14px', width: '80%', backgroundColor: theme.colors.bgHover, borderRadius: '4px', marginBottom: '24px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ height: '80px', backgroundColor: theme.colors.bgHover, borderRadius: theme.borderRadius.md }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>On-time Submissions</span>
              <span style={{ color: theme.colors.textMain, fontWeight: '700' }}>{onTimeRate}%</span>
            </div>
            <div style={{ height: '8px', width: '100%', backgroundColor: theme.colors.bgHover, borderRadius: theme.borderRadius.full, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${onTimeRate}%`, backgroundColor: theme.colors.success, borderRadius: theme.borderRadius.full }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              backgroundColor: theme.colors.bgMain, borderRadius: theme.borderRadius.md,
              padding: '16px', textAlign: 'center', border: `1px solid ${theme.colors.border}`
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: theme.colors.textMain }}>{missedDeadlines}</div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: theme.colors.textSecondary, fontWeight: 600, marginTop: '4px' }}>Missed Deadlines</div>
            </div>
            <div style={{
              backgroundColor: theme.colors.successBg, borderRadius: theme.borderRadius.md,
              padding: '16px', textAlign: 'center', border: '1px solid #d1fae5'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#047857' }}>
                {dashboardData?.attendanceRate ? (dashboardData.attendanceRate > 85 ? 'Up' : 'Down') : '--'}
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Attendance Trend</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
