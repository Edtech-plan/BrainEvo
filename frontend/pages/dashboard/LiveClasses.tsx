import React from 'react';
import { theme } from '../../src/shared/components/ui/theme';
import OngoingClass from '@/shared/components/live/OngoingClass';
import TodayClasses from '@/shared/components/live/TodayClasses';
import UpcomingClasses from '@/shared/components/live/UpcomingClasses';
import PastClasses from '@/shared/components/live/PastClasses';

function LiveClasses() {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
         <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: theme.colors.textMain, 
            marginBottom: '4px',
            margin: 0
         }}>
            Live Classes
         </h1>
         <p style={{ 
            color: theme.colors.textSecondary, 
            margin: 0,
            fontSize: '14px'
         }}>
            Manage your schedule, join ongoing sessions, and review past lectures.
         </p>
      </div>

      <OngoingClass />
      <TodayClasses />
      <UpcomingClasses />
      <PastClasses />
    </div>
  );
}

export default LiveClasses;
