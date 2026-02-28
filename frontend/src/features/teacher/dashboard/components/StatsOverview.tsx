import React from 'react';
import { DashboardStats } from '../../../../shared/types/dashboard.types';
import { theme } from '../../../../../styles/theme';

const StatCard = ({ label, value, trend, isHighlight }: { label: string; value: string | number; trend?: string; isHighlight?: boolean }) => (
  <div
    className="p-6 transition-transform hover:-translate-y-1"
    style={{
      backgroundColor: theme.colors.bgSurface,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`, // Fixed: No dynamic colored border
    }}
  >
    <p 
      className="text-xs font-bold uppercase tracking-wider mb-2"
      style={{ color: theme.colors.textSecondary }}
    >
      {label}
    </p>
    <div className="flex items-baseline justify-between">
      <h3 
        className="text-3xl font-bold"
        style={{ color: theme.colors.textMain }}
      >
        {value}
      </h3>
      {trend && (
        <span 
          className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: theme.colors.successBg,
            color: theme.colors.successText 
          }}
        >
          {trend}
        </span>
      )}
    </div>
  </div>
);

export const StatsOverview = ({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) => {
  if (loading || !stats) return <div className="h-32 bg-gray-100 animate-pulse rounded-xl mb-8"></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        label="Pending Grading" 
        value={stats.pendingAssignments} 
        trend="Needs Action" 
        isHighlight={true}
      />
      <StatCard 
        label="Avg. Attendance" 
        value={`${stats.avgAttendance}%`} 
        trend="↑ 2%" 
      />
      <StatCard 
        label="Engagement" 
        value={`${stats.studentEngagement}%`} 
      />
      <StatCard 
        label="Total Students" 
        value={stats.totalStudents} 
      />
    </div>
  );
};
