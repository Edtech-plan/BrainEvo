import apiClient from '../../shared/lib/axios';
import type { User, ApiResponse } from '../../shared/types';

/**
 * User Service
 */
class UserService {
  async getUsers(): Promise<ApiResponse<User[]>> {
    const response = await apiClient.get<ApiResponse<User[]>>('/api/users');
    return response.data;
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }
}

export default new UserService();
