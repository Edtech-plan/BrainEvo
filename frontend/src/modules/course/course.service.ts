import apiClient from '../../shared/lib/axios';

/**
 * Course Service
 */
class CourseService {
  async getCourses() {
    const response = await apiClient.get('/api/courses');
    return response.data;
  }

  async getCourse(id: string) {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data;
  }

  async createCourse(courseData: any) {
    const response = await apiClient.post('/api/courses', courseData);
    return response.data;
  }

  async updateCourse(id: string, courseData: any) {
    const response = await apiClient.put(`/api/courses/${id}`, courseData);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await apiClient.delete(`/api/courses/${id}`);
    return response.data;
  }
}

export default new CourseService();
