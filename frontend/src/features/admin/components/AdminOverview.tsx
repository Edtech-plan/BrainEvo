import React from 'react';
import { Building2, Users } from 'lucide-react';
import { theme } from '../../../shared/components/ui/theme';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export const AdminOverview = () => {
  const { organization, members, loading, error } = useAdminDashboard();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.textSecondary }}>
        Loading admin data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: theme.colors.error }}>
        {error}
      </div>
    );
  }

  const learnerCount = members.filter((m) => m.role === 'learner').length;
  const teacherCount = members.filter((m) => m.role === 'teacher').length;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: theme.colors.textMain,
            margin: 0,
            marginBottom: '8px',
          }}
        >
          {organization ? `${organization.name} - Admin` : 'Admin Dashboard'}
        </h1>
        <p
          style={{
            color: theme.colors.textSecondary,
            fontSize: '16px',
            margin: 0,
          }}
        >
          {organization
            ? 'Manage your organization and members.'
            : 'Create or join an organization to manage members.'}
        </p>
      </div>

      {organization && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.bgSurface,
                padding: '24px',
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building2 size={24} color={theme.colors.primary} />
                <span style={{ fontWeight: 600, color: theme.colors.textMain }}>Organization</span>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: theme.colors.textMain }}>
                {organization.name}
              </p>
              {organization.contactEmail && (
                <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginTop: '4px', margin: 0 }}>
                  {organization.contactEmail}
                </p>
              )}
            </div>
            <div
              style={{
                backgroundColor: theme.colors.bgSurface,
                padding: '24px',
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Users size={24} color={theme.colors.primary} />
                <span style={{ fontWeight: 600, color: theme.colors.textMain }}>Total Members</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: theme.colors.textMain }}>
                {members.length}
              </p>
              <p style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px', margin: 0 }}>
                {learnerCount} learners, {teacherCount} teachers
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: theme.colors.bgSurface,
              padding: '24px',
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: theme.colors.textMain }}>
              Organization Members
            </h2>
            {members.length === 0 ? (
              <p style={{ color: theme.colors.textSecondary, margin: 0 }}>No members yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${theme.colors.border}` }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: theme.colors.textSecondary, fontWeight: 600 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: theme.colors.textSecondary, fontWeight: 600 }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: theme.colors.textSecondary, fontWeight: 600 }}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                        <td style={{ padding: '12px', color: theme.colors.textMain }}>{m.name}</td>
                        <td style={{ padding: '12px', color: theme.colors.textSecondary }}>{m.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: theme.borderRadius.md,
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              backgroundColor: theme.colors.primaryLight,
                              color: theme.colors.primary,
                            }}
                          >
                            {m.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!organization && (
        <div
          style={{
            backgroundColor: theme.colors.bgSurface,
            padding: '40px',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ color: theme.colors.textSecondary, fontSize: '16px', margin: 0 }}>
            You are not associated with an organization yet. Create one during registration or contact support.
          </p>
        </div>
      )}
    </div>
  );
};
