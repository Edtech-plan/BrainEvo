import OngoingClass from './OngoingClass';
import TodayClasses from './TodayClasses';
import UpcomingClasses from './UpcomingClasses';
import PastClasses from './PastClasses';
import PageHeader from '@/shared/components/ui/PageHeader';

function LiveClasses() {
  return (
    // OPTIMIZATION: Same h-screen fix here
    <div className="h-screen overflow-y-auto bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-7xl mx-auto p-6 space-y-8 pb-32">
        <PageHeader 
          title="Live Classes" 
          description="Manage your schedule, join ongoing sessions, and review past lectures."
        />
        <OngoingClass />
        <TodayClasses />
        <UpcomingClasses />
        <PastClasses />
      </div>
    </div>
  );
}

export default LiveClasses;
