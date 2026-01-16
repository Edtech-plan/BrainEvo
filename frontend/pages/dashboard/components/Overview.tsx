import AttentionAlerts from "./overview/AttentionAlerts";
import ClassSnapshot from "./overview/ClassSnapshot";
import OverviewHeader from "./overview/OverviewHeader";
import OverviewStats from "./overview/OverviewStats";
import PerformanceSnapshot from "./overview/PerformanceSnapshot";
import UpcomingSchedule from "./overview/UpcomingSchedule";


function Overview() {
  return (
    // OPTIMIZATION: 
    // 1. h-screen: Forces exact viewport height (prevents overflow glitches).
    // 2. pb-32: Extra padding at bottom so you can scroll past the last element.
    <div className="h-screen overflow-y-auto bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-7xl mx-auto p-6 space-y-8 pb-32">
        <OverviewHeader />

        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClassSnapshot />
              <UpcomingSchedule />
            </div>
            <PerformanceSnapshot />
          </div>

          <div className="lg:col-span-4">
            <AttentionAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
