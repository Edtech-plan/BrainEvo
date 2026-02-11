import React from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Replaced alert with toast
import { WelcomeHeader } from './WelcomeHeader';
import { LiveControlPanel } from './LiveControlPanel';
import { StatsOverview } from './StatsOverview';
import { ActivityFeed } from './ActivityFeed';
import { QuickSchedule } from './QuickSchedule';
import { QuickUploadWidget } from './QuickUploadWidget';

import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { useLiveStatus } from '../hooks/useLiveStatus';
import { DashboardService } from '../services/dashboard.service';

interface OverviewProps {
  username: string; // Receive from parent page
}

export default function Overview({ username }: OverviewProps) {
  const { stats, loading: statsLoading, error: statsError } = useDashboardMetrics();
  const { activities, loading: feedLoading } = useActivityFeed();
  const { nextClass, schedule, loading: liveLoading } = useLiveStatus();

  const handleStartClass = async (classId: string) => {
    try {
      await DashboardService.startLiveClass(classId);
      toast.success('Class Started Successfully!'); // Professional notification
    } catch (e) {
      toast.error('Failed to start class. Please try again.');
    }
  };

  // CSS for Responsive Grid
  const css = `
    .grid-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    @media (min-width: 1024px) {
      .grid-main { grid-template-columns: 2fr 1fr; }
    }
  `;

  if (statsError) {
    return <div className="p-8 text-center text-red-500">Error: {statsError}</div>;
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      <style>{css}</style>
      <Toaster position="top-right" /> {/* Place toaster */}
      
      <WelcomeHeader username={username} /> {/* Pass prop */}

      <div style={{ marginTop: '24px' }}>
        <LiveControlPanel 
          nextClass={nextClass} 
          loading={liveLoading} 
          onStartClass={handleStartClass} 
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <StatsOverview stats={stats} loading={statsLoading} />
      </div>

      <div className="grid-main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ActivityFeed logs={activities} loading={feedLoading} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <QuickSchedule schedule={schedule} />
          <QuickUploadWidget />
        </div>
      </div>
    </div>
  );
}
