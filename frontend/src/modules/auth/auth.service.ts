import apiClient from '../../shared/lib/axios';

/**
 * Auth Service
 */
class AuthService {
  async register(userData: any) {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  }

  async getMe() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
}

export default new AuthService();
