import apiClient from '../../shared/lib/axios';
import type { Course, CreateCourseData, UpdateCourseData, ApiResponse } from '../../shared/types';

/**
 * Course Service
 */
class CourseService {
  async getCourses(page = 1, limit = 20): Promise<ApiResponse<Course[]>> {
    const response = await apiClient.get<ApiResponse<Course[]>>(
      `/api/courses?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    const response = await apiClient.get<ApiResponse<Course>>(`/api/courses/${id}`);
    return response.data;
  }

  async createCourse(courseData: CreateCourseData): Promise<ApiResponse<Course>> {
    const response = await apiClient.post<ApiResponse<Course>>('/api/courses', courseData);
    return response.data;
  }

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<ApiResponse<Course>> {
    const response = await apiClient.put<ApiResponse<Course>>(`/api/courses/${id}`, courseData);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await apiClient.delete(`/api/courses/${id}`);
    return response.data;
  }
}

export default new CourseService();
