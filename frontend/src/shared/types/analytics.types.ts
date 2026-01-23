/**
 * Analytics Types
 */

export interface DashboardAnalytics {
  totalCourses: number;
  totalEnrollments: number;
  totalAssignments: number;
  totalSubmissions: number;
  attendanceRate?: number;
  completionRate?: number;
  recentActivity?: RecentActivity[];
}

export interface CourseAnalytics {
  enrollments: number;
  assignments: number;
  submissions: number;
  averageScore?: number;
  completionRate?: number;
}

export interface RecentActivity {
  type: 'assignment' | 'live_class' | 'submission' | 'enrollment';
  title: string;
  timestamp: string;
  courseId?: string;
}
