import { useState, useEffect, useCallback } from 'react';
import { AdminService } from '../services/admin.service';
import type { User } from '../../../shared/types';

interface Organization {
  id?: string;
  _id?: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
}

export const useAdminDashboard = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const org = await AdminService.getMyOrganization();
      setOrganization(org ?? null);
      if (org) {
        const orgId = (org as { id?: string }).id ?? (org as { _id?: string })._id;
        if (orgId && typeof orgId === 'string') {
          const memberList = await AdminService.getOrganizationMembers(orgId);
          setMembers(memberList);
        }
      }
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { organization, members, loading, error, refetch: fetchData };
};
