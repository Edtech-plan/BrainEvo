import React from 'react';
import OverviewHeader from "../../src/shared/components/overview/OverviewHeader";
import OverviewStats from "../../src/shared/components/overview/OverviewStats";
import ClassSnapshot from "../../src/shared/components/overview/ClassSnapshot";
import UpcomingSchedule from "../../src/shared/components/overview/UpcomingSchedule";
import PerformanceSnapshot from "../../src/shared/components/overview/PerformanceSnapshot";
import AttentionAlerts from "../../src/shared/components/overview/AttentionAlerts";

function Overview() {
  return (
    <div className="pb-20">
      <OverviewHeader />
      
      <div className="mt-6">
        <OverviewStats />
      </div>

      {/* Responsive Grid: Stacks on mobile, splits on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        
        {/* Main Content: Takes full width on mobile, 8/12 on large screens */}
        <div className="xl:col-span-8 space-y-6">
          {/* Sub-grid: Stack on mobile, side-by-side on tablet+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClassSnapshot />
            <UpcomingSchedule />
          </div>
          <PerformanceSnapshot />
        </div>

        {/* Sidebar Alerts: Takes full width on mobile, 4/12 on large screens */}
        <div className="xl:col-span-4">
          <AttentionAlerts />
        </div>
      </div>
    </div>
  );
}
export default Overview;
