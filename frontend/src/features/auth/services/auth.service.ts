import apiClient from '../../../shared/lib/axios';
import type { RegisterUserData, AuthResponse, ApiResponse, User } from '../../../shared/types';

/**
 * Auth Service
 */
class AuthService {
  async register(userData: RegisterUserData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', { email, password });
    return response.data;
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/api/auth/me');
    return response.data;
  }
}

const authService = new AuthService();
export default authService;
