import apiClient from '../../../shared/lib/axios';
import type { LiveClass, CreateLiveClassData, UpdateLiveClassData, ApiResponse } from '../../../shared/types';

/**
 * Live Class Service
 * Handles live class-related API calls
 */
class LiveClassService {
  async getLiveClasses(): Promise<ApiResponse<LiveClass[]>> {
    const response = await apiClient.get<ApiResponse<LiveClass[]>>('/api/live-classes');
    return response.data;
  }

  async getLiveClass(id: string): Promise<ApiResponse<LiveClass>> {
    const response = await apiClient.get<ApiResponse<LiveClass>>(`/api/live-classes/${id}`);
    return response.data;
  }

  async createLiveClass(liveClassData: CreateLiveClassData): Promise<ApiResponse<LiveClass>> {
    const response = await apiClient.post<ApiResponse<LiveClass>>('/api/live-classes', liveClassData);
    return response.data;
  }

  async updateLiveClass(id: string, liveClassData: UpdateLiveClassData): Promise<ApiResponse<LiveClass>> {
    const response = await apiClient.put<ApiResponse<LiveClass>>(`/api/live-classes/${id}`, liveClassData);
    return response.data;
  }

  async deleteLiveClass(id: string) {
    const response = await apiClient.delete(`/api/live-classes/${id}`);
    return response.data;
  }
}

const liveClassService = new LiveClassService();
export default liveClassService;
