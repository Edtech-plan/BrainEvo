import apiClient from '../../shared/lib/axios';

/**
 * Analytics Service
 */
class AnalyticsService {
  async getDashboard() {
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data;
  }

  async getCourseAnalytics(courseId: string) {
    const response = await apiClient.get(`/api/analytics/course/${courseId}`);
    return response.data;
  }
}

export default new AnalyticsService();
