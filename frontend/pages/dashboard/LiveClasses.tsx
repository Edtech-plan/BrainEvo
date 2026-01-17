// LiveClasses.tsx
import React from 'react';
import OngoingClass from '../../src/shared/components/live/OngoingClass';
import TodayClasses from '../../src/shared/components/live/TodayClasses';
import UpcomingClasses from '../../src/shared/components/live/UpcomingClasses';
import PastClasses from '../../src/shared/components/live/PastClasses';
import { theme } from '@/shared/components/ui/theme';
import { PageHeader } from '@/shared/components/ui';

function LiveClasses() {
  return (
    <div style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      backgroundColor: theme.colors.bgMain, // Using theme.colors.bgMain (Slate-50)
      scrollbarWidth: 'none', 
      msOverflowStyle: 'none'
    }} className="[&::-webkit-scrollbar]:hidden">
      <div className="max-w-7xl mx-auto space-y-8 pb-32">
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
