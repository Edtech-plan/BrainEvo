import apiClient from '../../shared/lib/axios';
import type {
  CreateOrganizationData,
  UpdateOrganizationData,
  OrganizationResponse,
  OrganizationListResponse,
  ApiResponse,
  User,
} from '../../shared/types';

/**
 * Organization Service
 * Handles organization-related API calls
 */
class OrganizationService {
  /**
   * Create a new organization
   */
  async create(organizationData: CreateOrganizationData): Promise<OrganizationResponse> {
    const response = await apiClient.post<OrganizationResponse>(
      '/api/organizations',
      organizationData
    );
    return response.data;
  }

  /**
   * Get current user's organization
   */
  async getMyOrganization(): Promise<OrganizationResponse> {
    const response = await apiClient.get<OrganizationResponse>('/api/organizations/me');
    return response.data;
  }

  /**
   * Get organization by ID
   */
  async getById(id: string): Promise<OrganizationResponse> {
    const response = await apiClient.get<OrganizationResponse>(`/api/organizations/${id}`);
    return response.data;
  }

  /**
   * Update organization
   */
  async update(
    id: string,
    updateData: UpdateOrganizationData
  ): Promise<OrganizationResponse> {
    const response = await apiClient.put<OrganizationResponse>(
      `/api/organizations/${id}`,
      updateData
    );
    return response.data;
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: string): Promise<ApiResponse<User[]>> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/api/organizations/${organizationId}/members`
    );
    return response.data;
  }
}

export default new OrganizationService();
