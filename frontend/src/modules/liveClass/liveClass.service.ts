import apiClient from '../../shared/lib/axios';

/**
 * Live Class Service
 */
class LiveClassService {
  async getLiveClasses() {
    const response = await apiClient.get('/api/live-classes');
    return response.data;
  }

  async getLiveClass(id: string) {
    const response = await apiClient.get(`/api/live-classes/${id}`);
    return response.data;
  }

  async createLiveClass(liveClassData: any) {
    const response = await apiClient.post('/api/live-classes', liveClassData);
    return response.data;
  }

  async updateLiveClass(id: string, liveClassData: any) {
    const response = await apiClient.put(`/api/live-classes/${id}`, liveClassData);
    return response.data;
  }

  async deleteLiveClass(id: string) {
    const response = await apiClient.delete(`/api/live-classes/${id}`);
    return response.data;
  }
}

export default new LiveClassService();
