import AttentionAlerts from "./overview/AttentionAlerts";
import ClassSnapshot from "./overview/ClassSnapshot";
import OverviewHeader from "./overview/OverviewHeader";
import OverviewStats from "./overview/OverviewStats";
import PerformanceSnapshot from "./overview/PerformanceSnapshot";
import UpcomingSchedule from "./overview/UpcomingSchedule";


function Overview() {
  return (
    <div className="space-y-6">
      <OverviewHeader />

      <OverviewStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClassSnapshot />
        <UpcomingSchedule />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceSnapshot />
        <AttentionAlerts />
      </div>
    </div>
  );
}

export default Overview;
