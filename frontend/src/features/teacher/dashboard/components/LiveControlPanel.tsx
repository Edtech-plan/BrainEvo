import React from 'react';
import { ClassSession } from '../../../../shared/types/dashboard.types';
import { theme } from '../../../../../styles/theme';

interface LiveControlPanelProps { nextClass: ClassSession | null; loading: boolean; onStartClass: (id: string) => void; }

export const LiveControlPanel = ({ nextClass, loading, onStartClass }: LiveControlPanelProps) => {
  if (loading) return <div className="h-48 bg-gray-100 animate-pulse rounded-xl mb-8"></div>;
  if (!nextClass) return null;
  const isLive = nextClass.status === 'LIVE';
  const time = new Date(nextClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.md, borderLeft: `6px solid ${isLive ? theme.colors.error : theme.colors.primary}` }}>
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 ${isLive ? 'animate-pulse' : ''}`} style={{ backgroundColor: isLive ? theme.colors.errorBg : theme.colors.primaryLight, color: isLive ? theme.colors.error : theme.colors.primary }}>
            {isLive && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.error }} />}
            {isLive ? 'Live Now' : 'Up Next'}
          </span>
          <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>Starts at {time}</span>
        </div>
        <h2 className="text-3xl font-bold leading-tight" style={{ color: theme.colors.textMain }}>{nextClass.title}</h2>
        <p className="text-lg mt-1" style={{ color: theme.colors.textSecondary }}>{nextClass.batchName}</p>
      </div>
      <button onClick={() => onStartClass(nextClass.id)} className="px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 border-none cursor-pointer" style={{ backgroundColor: isLive ? theme.colors.error : theme.colors.primary }}>
        {isLive ? 'Join Session' : 'Start Class'}
      </button>
    </div>
  );
};
