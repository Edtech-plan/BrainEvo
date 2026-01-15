/**
 * Invitation Types
 */

import { UserRole } from './user.types';
import { Organization } from './organization.types';

export interface Invitation {
  id: string;
  organizationId: string | Organization;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt?: string | null;
  invitedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvitationData {
  email: string;
  role: 'learner' | 'teacher';
  organizationId: string;
}

export interface InvitationResponse {
  success: boolean;
  invitation: Invitation;
}

export interface InvitationListResponse {
  success: boolean;
  invitations: Invitation[];
}

export interface VerifyInvitationResponse {
  success: boolean;
  invitation: Invitation;
}
