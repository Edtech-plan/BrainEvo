/**
 * Organization Types
 */

export interface Organization {
  id: string;
  name: string;
  adminId: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrganizationData {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface OrganizationResponse {
  success: boolean;
  organization: Organization;
}

export interface OrganizationListResponse {
  success: boolean;
  organizations: Organization[];
}
