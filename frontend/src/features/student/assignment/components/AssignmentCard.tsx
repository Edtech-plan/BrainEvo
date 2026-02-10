import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Assignment } from '../../../../shared/types/assignment.types';
import { Calendar, ChevronRight } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onClick: () => void;
}

export default function AssignmentCard({ assignment, onClick }: AssignmentCardProps) {
  const isOverdue = assignment.status === 'OVERDUE';
  const isGraded = assignment.status === 'GRADED';

  // Status Styling Logic
  const getStatusBadge = () => {
    if (isGraded) return { label: 'Graded', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
    if (assignment.status === 'SUBMITTED') return { label: 'Submitted', bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' };
    if (isOverdue) return { label: 'Overdue', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' };
    return { label: 'Pending', bg: '#fffbeb', color: '#b45309', border: '#fde68a' }; // Amber for pending
  };

  const badge = getStatusBadge();

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.bgSurface,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 20px -8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = theme.colors.primaryLight;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      {/* Top Meta Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, color: theme.colors.textSecondary,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          backgroundColor: theme.colors.bgMain, padding: '6px 10px', borderRadius: '6px'
        }}>
          {assignment.subject}
        </span>

        <div style={{
          padding: '4px 10px', borderRadius: '99px',
          backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'
        }}>
          {badge.label}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: 'auto' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '8px', lineHeight: '1.4' }}>
          {assignment.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOverdue ? theme.colors.error : theme.colors.textSecondary, fontSize: '13px', fontWeight: 500 }}>
          <Calendar size={14} />
          <span>
            {isGraded ? 'Completed on ' : 'Due '}
            {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Footer / Instructor & Score */}
      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${theme.colors.bgMain}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Instructor Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', backgroundColor: theme.colors.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: theme.colors.primary
          }}>
            {assignment.instructorName.charAt(0)}
          </div>
          <span style={{ fontSize: '13px', color: theme.colors.textSecondary, fontWeight: 500 }}>
            {assignment.instructorName}
          </span>
        </div>

        {/* Action / Grade */}
        {isGraded ? (
           <div style={{ fontSize: '16px', fontWeight: 800, color: theme.colors.textMain }}>
             {assignment.mySubmission?.grade}<span style={{ fontSize: '12px', color: theme.colors.textSecondary, fontWeight: 500 }}>/{assignment.pointsTotal}</span>
           </div>
        ) : (
           <div style={{
             width: '32px', height: '32px', borderRadius: '50%',
             backgroundColor: theme.colors.bgHover, display: 'flex', alignItems: 'center', justifyContent: 'center',
             color: theme.colors.textMain
           }}>
             <ChevronRight size={18} />
           </div>
        )}
      </div>
    </button>
  );
}
