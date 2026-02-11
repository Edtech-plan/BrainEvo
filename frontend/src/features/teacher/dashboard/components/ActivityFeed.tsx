import React from 'react';
import { ActivityLog } from '../../../../shared/types/dashboard.types';
import { theme } from '../../../../shared/components/ui/theme';

export const ActivityFeed = ({ logs, loading }: { logs: ActivityLog[]; loading: boolean }) => {
  return (
    <div className="p-6 h-full" style={{ backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}` }}>
      <h3 className="text-lg font-bold mb-6" style={{ color: theme.colors.textMain }}>Recent Activity</h3>
      {loading ? <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded animate-pulse"></div>)}</div> : 
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}>{log.type.substring(0,2).toUpperCase()}</div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.colors.textMain }}><span className="font-bold">{log.user}</span> {log.action}</p>
                <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>{log.target} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
