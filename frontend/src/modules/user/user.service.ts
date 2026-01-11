import apiClient from '../../shared/lib/axios';

/**
 * User Service
 */
class UserService {
  async getUsers() {
    const response = await apiClient.get('/api/users');
    return response.data;
  }

  async getUser(id: string) {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: any) {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  }
}

export default new UserService();
