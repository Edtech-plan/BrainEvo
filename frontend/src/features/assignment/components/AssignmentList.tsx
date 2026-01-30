import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Assignment } from '@/shared/types/assignment.types'; // Fixed Import Path
import AssignmentCard from './AssignmentCard';

// Fix: Exported Interface as requested
export interface AssignmentListProps {
  assignments: Assignment[];
  loading: boolean;
  onSelect: (a: Assignment) => void;
}

export default function AssignmentList({ assignments, loading, onSelect }: AssignmentListProps) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
    gap: '20px'
  };

  if (loading) return (
    <div style={gridStyle}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: '220px', backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`, opacity: 0.5 }} />
      ))}
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {assignments.length === 0 ? (
        <div style={{ 
          backgroundColor: theme.colors.bgSurface, padding: '60px 20px', borderRadius: theme.borderRadius.lg,
          textAlign: 'center', border: `1px dashed ${theme.colors.border}`
        }}>
          <p style={{ fontSize: '16px', fontWeight: 600, color: theme.colors.textMain, marginBottom: '8px' }}>All caught up!</p>
          <p style={{ color: theme.colors.textSecondary, margin: 0 }}>No assignments found in this category.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {assignments.map(a => (
            <AssignmentCard key={a.id} assignment={a} onClick={() => onSelect(a)} />
          ))}
        </div>
      )}
    </div>
  );
}
