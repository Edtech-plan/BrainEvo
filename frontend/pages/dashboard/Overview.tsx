import AttentionAlerts from '@/shared/components/overview/AttentionAlerts';
import ClassSnapshot from '@/shared/components/overview/ClassSnapshot';
import OverviewHeader from '@/shared/components/overview/OverviewHeader';
import OverviewStats from '@/shared/components/overview/OverviewStats';
import PerformanceSnapshot from '@/shared/components/overview/PerformanceSnapshot';
import UpcomingSchedule from '@/shared/components/overview/UpcomingSchedule';
import React from 'react';

function Overview() {
  const css = `
    .grid-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    .grid-sub {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    @media (min-width: 768px) {
      .grid-sub { grid-template-columns: 1fr 1fr; }
    }

    @media (min-width: 1024px) {
      .grid-main { grid-template-columns: 2fr 1fr; }
    }

    @media (min-width: 1280px) {
      .grid-main { grid-template-columns: 3fr 1fr; }
    }
  `;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <style>{css}</style>
      <OverviewHeader />
      
      <div style={{ marginTop: '24px' }}>
        <OverviewStats />
      </div>

      <div className="grid-main">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="grid-sub">
            <ClassSnapshot />
            <UpcomingSchedule />
          </div>
          <PerformanceSnapshot />
        </div>
        <div>
          <AttentionAlerts />
        </div>
      </div>
    </div>
  );
}
export default Overview;
