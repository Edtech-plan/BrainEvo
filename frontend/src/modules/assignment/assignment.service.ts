import apiClient from '../../shared/lib/axios';

/**
 * Assignment Service
 */
class AssignmentService {
  async getAssignments() {
    const response = await apiClient.get('/api/assignments');
    return response.data;
  }

  async getAssignment(id: string) {
    const response = await apiClient.get(`/api/assignments/${id}`);
    return response.data;
  }

  async createAssignment(assignmentData: any) {
    const response = await apiClient.post('/api/assignments', assignmentData);
    return response.data;
  }

  async updateAssignment(id: string, assignmentData: any) {
    const response = await apiClient.put(`/api/assignments/${id}`, assignmentData);
    return response.data;
  }

  async deleteAssignment(id: string) {
    const response = await apiClient.delete(`/api/assignments/${id}`);
    return response.data;
  }
}

export default new AssignmentService();
