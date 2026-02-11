export interface DashboardStats {
  pendingAssignments: number;
  avgAttendance: number; // 0-100 percentage
  studentEngagement: number; // 0-100 percentage
  totalStudents: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'submission' | 'enrollment' | 'query' | 'system';
}

export interface ClassSession {
  id: string;
  title: string;
  batchName: string;
  startTime: string; // ISO Date String
  endTime: string;   // ISO Date String
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityLog[];
  nextClass: ClassSession | null;
  todaySchedule: ClassSession[];
}
