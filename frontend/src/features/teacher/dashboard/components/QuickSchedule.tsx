import React from 'react';
import { ClassSession } from '../../../../shared/types/dashboard.types';
import { theme } from '../../../../shared/components/ui/theme';

export const QuickSchedule = ({ schedule }: { schedule: ClassSession[] }) => {
  return (
    <div className="p-6 h-full" style={{ backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}` }}>
      <h3 className="text-lg font-bold mb-6 flex items-center justify-between" style={{ color: theme.colors.textMain }}>
        Today's Schedule <span className="text-xs font-normal px-2 py-1 rounded-md" style={{ backgroundColor: theme.colors.bgMain, color: theme.colors.textSecondary }}>{schedule.length}</span>
      </h3>
      <div className="space-y-6">
        {schedule.length === 0 ? <p className="text-sm text-center py-8" style={{ color: theme.colors.textSecondary }}>No classes today.</p> : 
          schedule.map((session) => (
            <div key={session.id} className="relative pl-6 pb-2">
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: theme.colors.border }} />
              <div className="absolute -left-[5px] top-0 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: theme.colors.primary }} />
              <div className="mb-1"><span className="text-xs font-bold" style={{ color: theme.colors.primary }}>{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <h4 className="text-sm font-bold leading-tight" style={{ color: theme.colors.textMain }}>{session.title}</h4>
              <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>{session.batchName}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};
