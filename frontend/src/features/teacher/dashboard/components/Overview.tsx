// src/features/teacher/dashboard/components/Overview.tsx

import React from 'react';
import { WelcomeHeader } from './WelcomeHeader';
import { LiveControlPanel } from './LiveControlPanel';
import { StatsOverview } from './StatsOverview';
import { ActivityFeed } from './ActivityFeed';
import { QuickSchedule } from './QuickSchedule';
import { QuickUploadWidget } from './QuickUploadWidget';

// Importing Hooks
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { useLiveStatus } from '../hooks/useLiveStatus';
import { DashboardService } from '../services/dashboard.service';

export default function Overview() {
  // Data Fetching
  const { stats, loading: statsLoading } = useDashboardMetrics();
  const { activities, loading: feedLoading } = useActivityFeed();
  const { nextClass, schedule, loading: liveLoading } = useLiveStatus();

  const handleStartClass = async (classId: string) => {
    try {
      await DashboardService.startLiveClass(classId);
      alert('Class Started!');
    } catch (e) {
      alert('Error starting class');
    }
  };

  // CSS for Responsive Grid (Matching Student Dashboard pattern)
  const css = `
    .grid-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    
    @media (min-width: 1024px) {
      .grid-main {
        grid-template-columns: 2fr 1fr; /* 2/3 Left, 1/3 Right */
      }
    }
  `;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <style>{css}</style>
      
      {/* 1. Header */}
      <WelcomeHeader />

      {/* 2. Hero Widget */}
      <div style={{ marginTop: '24px' }}>
        <LiveControlPanel 
          nextClass={nextClass} 
          loading={liveLoading} 
          onStartClass={handleStartClass} 
        />
      </div>

      {/* 3. Stats Grid */}
      <div style={{ marginTop: '24px' }}>
        <StatsOverview stats={stats} loading={statsLoading} />
      </div>

      {/* 4. Main Content Grid */}
      <div className="grid-main">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ActivityFeed logs={activities} loading={feedLoading} />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <QuickSchedule schedule={schedule} />
          <QuickUploadWidget />
        </div>
      </div>
    </div>
  );
}
