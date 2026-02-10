import apiClient from '../../../../shared/lib/axios';
import type { ApiResponse } from '../../../../shared/types';
import type { DashboardAnalytics, CourseAnalytics } from '../../../../shared/types/analytics.types';

/**
 * Dashboard Service
 * Handles dashboard-related API calls
 */
class DashboardService {
  /**
   * Get dashboard analytics data
   */
  async getDashboardAnalytics(): Promise<ApiResponse<DashboardAnalytics>> {
    const response = await apiClient.get<ApiResponse<DashboardAnalytics>>('/api/analytics/dashboard');
    return response.data;
  }

  /**
   * Get course analytics
   */
  async getCourseAnalytics(courseId: string): Promise<ApiResponse<CourseAnalytics>> {
    const response = await apiClient.get<ApiResponse<CourseAnalytics>>(`/api/analytics/course/${courseId}`);
    return response.data;
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
