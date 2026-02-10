// src/features/teacher/dashboard/services/dashboard.service.ts

import { DashboardStats, ActivityLog, ClassSession } from '../../../../shared/types/dashboard.types';

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      pendingAssignments: 5,
      avgAttendance: 88,
      studentEngagement: 92,
      totalStudents: 124,
    };
  },

  getActivity: async (): Promise<ActivityLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: '1', user: 'Kush Kore', action: 'submitted', target: 'Thermodynamics HW', timestamp: new Date().toISOString(), type: 'submission' },
      { id: '2', user: 'System', action: 'processed recording', target: 'Physics Batch', timestamp: new Date().toISOString(), type: 'system' }
    ];
  },

  getScheduleData: async (): Promise<{ nextClass: ClassSession | null, todaySchedule: ClassSession[] }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = Date.now();
    const schedule: ClassSession[] = [
      { id: '101', title: 'Advanced Calculus', batchName: 'Engineering Math', startTime: new Date(now + 3600000).toISOString(), endTime: new Date(now + 7200000).toISOString(), status: 'SCHEDULED' },
      { id: '102', title: 'Physics Doubt Session', batchName: 'Evening Batch', startTime: new Date(now + 18000000).toISOString(), endTime: new Date(now + 21600000).toISOString(), status: 'SCHEDULED' }
    ];
    return { nextClass: schedule[0], todaySchedule: schedule };
  },

  startLiveClass: async (classId: string): Promise<void> => {
    console.log(`Starting class ${classId}`);
  }
};
