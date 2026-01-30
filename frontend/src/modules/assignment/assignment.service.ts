import apiClient from '../../shared/lib/axios';
import type { Assignment, CreateAssignmentData, UpdateAssignmentData, ApiResponse } from '../../shared/types';

/**
 * Assignment Service
 */
class AssignmentService {
  async getAssignments(): Promise<ApiResponse<Assignment[]>> {
    const response = await apiClient.get<ApiResponse<Assignment[]>>('/api/assignments');
    return response.data;
  }

  async getAssignment(id: string): Promise<ApiResponse<Assignment>> {
    const response = await apiClient.get<ApiResponse<Assignment>>(`/api/assignments/${id}`);
    return response.data;
  }

  async createAssignment(assignmentData: CreateAssignmentData): Promise<ApiResponse<Assignment>> {
    const response = await apiClient.post<ApiResponse<Assignment>>('/api/assignments', assignmentData);
    return response.data;
  }

  async updateAssignment(id: string, assignmentData: UpdateAssignmentData): Promise<ApiResponse<Assignment>> {
    const response = await apiClient.put<ApiResponse<Assignment>>(`/api/assignments/${id}`, assignmentData);
    return response.data;
  }

  async deleteAssignment(id: string) {
    const response = await apiClient.delete(`/api/assignments/${id}`);
    return response.data;
  }
}

const assignmentService = new AssignmentService();
export default assignmentService;
