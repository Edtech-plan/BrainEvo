import apiClient from '../../../shared/lib/axios';
import organizationService from '../../../modules/organization/organization.service';
import userService from '../../../modules/user/user.service';
import type { User } from '../../../shared/types';

interface Organization {
  id?: string;
  _id?: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
}

export const AdminService = {
  async getMyOrganization(): Promise<Organization | null> {
    try {
      const response = await organizationService.getMyOrganization() as { organization?: Organization };
      const org = response?.organization;
      if (org && typeof org === 'object') {
        return { ...org, id: (org as { _id?: string })._id ?? (org as { id?: string }).id };
      }
      return null;
    } catch {
      return null;
    }
  },

  async getOrganizationMembers(organizationId: string): Promise<User[]> {
    try {
      const response = await organizationService.getMembers(organizationId) as { data?: User[]; members?: User[] };
      const list = response?.members ?? response?.data ?? [];
      return Array.isArray(list) ? list.map((u) => ({ ...u, id: (u as { _id?: string })._id ?? (u as { id?: string }).id })) : [];
    } catch {
      return [];
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const response = await userService.getUsers();
      return (response as ApiResponse<User[]>)?.data ?? [];
    } catch {
      return [];
    }
  },
};
