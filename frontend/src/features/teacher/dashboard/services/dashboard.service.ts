// src/features/teacher/dashboard/services/dashboard.service.ts

import apiClient from '../../../../shared/lib/axios';
import type { DashboardStats, ActivityLog, ClassSession } from '../../../../shared/types/dashboard.types';

interface TeacherDashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    activities: ActivityLog[];
    nextClass: ClassSession | null;
    todaySchedule: ClassSession[];
  };
}

let cachedData: TeacherDashboardResponse['data'] | null = null;
let cacheTime = 0;
const CACHE_MS = 30000;

async function fetchTeacherDashboard() {
  if (cachedData && Date.now() - cacheTime < CACHE_MS) {
    return cachedData;
  }
  const response = await apiClient.get<TeacherDashboardResponse>('/api/analytics/teacher-dashboard');
  cachedData = response.data?.data ?? null;
  cacheTime = Date.now();
  return cachedData;
}

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const data = await fetchTeacherDashboard();
    return data?.stats ?? {
      pendingAssignments: 0,
      avgAttendance: 0,
      studentEngagement: 0,
      totalStudents: 0,
    };
  },

  getActivity: async (): Promise<ActivityLog[]> => {
    const data = await fetchTeacherDashboard();
    return data?.activities ?? [];
  },

  getScheduleData: async (): Promise<{ nextClass: ClassSession | null; todaySchedule: ClassSession[] }> => {
    const data = await fetchTeacherDashboard();
    return {
      nextClass: data?.nextClass ?? null,
      todaySchedule: data?.todaySchedule ?? [],
    };
  },

  startLiveClass: async (_classId: string): Promise<void> => {
    // TODO: Add backend endpoint for starting live class session
  },
};
