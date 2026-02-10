// src/features/teacher/dashboard/types/dashboard.types.ts

// Why: Defines the shape of the top-level metrics cards.
export interface DashboardStats {
  pendingAssignments: number;
  avgAttendance: number;      // 0-100 percentage
  studentEngagement: number;  // 0-100 percentage
  totalStudents: number;
}

// Why: Defines the shape of a single log in the Activity Feed.
export interface ActivityLog {
  id: string;
  user: string;         // e.g., "Kush Kore"
  action: string;       // e.g., "Submitted Assignment"
  target: string;       // e.g., "Physics Week 1"
  timestamp: string;    // ISO Date String
  type: 'submission' | 'enrollment' | 'query' | 'system';
}

// Why: Defines class data used in LiveControlPanel and QuickSchedule.
export interface ClassSession {
  id: string;
  title: string;
  batchName: string;
  startTime: string; // ISO Date String
  endTime: string;   // ISO Date String
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  meetingLink?: string;
}
