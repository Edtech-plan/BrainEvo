import apiClient from '../../shared/lib/axios';
import type {
  CreateInvitationData,
  InvitationResponse,
  InvitationListResponse,
  VerifyInvitationResponse,
  ApiResponse,
} from '../../shared/types';

/**
 * Invitation Service
 * Handles invitation-related API calls
 */
class InvitationService {
  /**
   * Verify an invitation token
   */
  async verifyInvitation(token: string): Promise<VerifyInvitationResponse> {
    const response = await apiClient.get<VerifyInvitationResponse>(
      `/api/invitations/verify?token=${token}`
    );
    return response.data;
  }

  /**
   * Create a new invitation
   */
  async createInvitation(
    invitationData: CreateInvitationData
  ): Promise<InvitationResponse> {
    const response = await apiClient.post<InvitationResponse>(
      '/api/invitations',
      invitationData
    );
    return response.data;
  }

  /**
   * Get invitations by organization
   */
  async getByOrganization(organizationId: string): Promise<InvitationListResponse> {
    const response = await apiClient.get<InvitationListResponse>(
      `/api/invitations/organization/${organizationId}`
    );
    return response.data;
  }

  /**
   * Delete an invitation
   */
  async deleteInvitation(invitationId: string): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/api/invitations/${invitationId}`);
    return response.data;
  }
}

export default new InvitationService();
