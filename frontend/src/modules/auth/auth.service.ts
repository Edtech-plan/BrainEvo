import apiClient from '../../shared/lib/axios';
import type { GoogleAuthData } from '../../shared/types';

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

  async googleAuth(googleData: GoogleAuthData) {
    const response = await apiClient.post('/api/auth/google', googleData);
    return response.data;
  }

  async getMe() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  }
}

export default new AuthService();
