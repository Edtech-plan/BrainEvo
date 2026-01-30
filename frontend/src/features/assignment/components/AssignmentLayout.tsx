import React, { useState } from 'react';
import { theme } from '@/shared/components/ui/theme';
import { useAssignments } from '../hooks/useAssignments';
import { Assignment } from '@/shared/types/assignment.types'; // Fixed Import Path
import { AlertCircle } from 'lucide-react';

// Fix: Using Barrel Imports
import { 
  AssignmentList, 
  AssignmentDetail, 
  AssignmentStats 
} from './index';

export default function AssignmentLayout() {
  // Fix: Destructure error
  const { assignments, loading, filter, setFilter, refresh, error } = useAssignments();
  const [selected, setSelected] = useState<Assignment | null>(null);

  const tabs: { id: typeof filter; label: string }[] = [
    { id: 'ALL', label: 'All Assignments' },
    { id: 'PENDING', label: 'To Do' },
    { id: 'GRADED', label: 'Completed' },
  ];

  if (selected) {
    return <AssignmentDetail assignment={selected} onBack={() => setSelected(null)} onSuccess={() => { setSelected(null); refresh(); }} />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: theme.colors.textMain, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Assignments
        </h1>
        <p style={{ color: theme.colors.textSecondary, fontSize: '15px', maxWidth: '600px', lineHeight: '1.5', margin: 0 }}>
          Manage your coursework, track upcoming deadlines, and review your graded performance.
        </p>
      </div>

      {/* Fix: Error Display UI */}
      {error && (
        <div style={{ 
          padding: '12px 16px', marginBottom: '20px', borderRadius: theme.borderRadius.md, 
          backgroundColor: theme.colors.errorBg, border: `1px solid ${theme.colors.error}30`,
          display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.error
        }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Fix: Removed !loading check, passed loading prop to component */}
      <AssignmentStats assignments={assignments} loading={loading} />

      <div style={{ 
        borderBottom: `1px solid ${theme.colors.border}`, 
        marginBottom: '24px',
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}>
        <div style={{ display: 'flex', gap: '32px', minWidth: 'min-content' }}>
          {tabs.map(tab => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                  color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                  flexShrink: 0
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AssignmentList assignments={assignments} loading={loading} onSelect={setSelected} />
    </div>
  );
}
