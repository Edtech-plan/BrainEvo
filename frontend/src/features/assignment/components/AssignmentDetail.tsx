import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Assignment } from '../../../shared/types/assignment.types';
import { ArrowLeft, Download, ExternalLink, Calendar, FileText } from 'lucide-react';
import FeedbackView from './FeedbackView';
import SubmissionArea from './SubmissionArea';


interface AssignmentDetailProps {
  assignment: Assignment;
  onBack: () => void;
  onSuccess: () => void;
}

export default function AssignmentDetail({ assignment, onBack, onSuccess }: AssignmentDetailProps) {
  const isCompleted = assignment.status === 'SUBMITTED' || assignment.status === 'GRADED';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          color: theme.colors.textSecondary, cursor: 'pointer', marginBottom: '24px', fontWeight: 600
        }}
      >
        <ArrowLeft size={18} /> Back to list
      </button>

      <div style={{ backgroundColor: theme.colors.bgSurface, borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`, padding: '40px' }}>
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${theme.colors.bgMain}`, paddingBottom: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '13px', color: theme.colors.primary, fontWeight: 700, textTransform: 'uppercase' }}>{assignment.subject}</span>
              <h1 style={{ margin: '8px 0', fontSize: '28px', fontWeight: 800, color: theme.colors.textMain }}>{assignment.title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textSecondary, fontSize: '14px' }}>
                <Calendar size={16} /> Due: <strong>{new Date(assignment.dueDate).toLocaleDateString()}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.textSecondary, fontSize: '14px', marginTop: '4px', justifyContent: 'flex-end' }}>
                <FileText size={16} /> Points: <strong>{assignment.pointsTotal}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '12px' }}>Instructions</h3>
          <p style={{ fontSize: '15px', color: theme.colors.textSecondary, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {assignment.description}
          </p>
        </div>

        {/* Attachments */}
        {assignment.attachments && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '12px' }}>Reference Materials</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {assignment.attachments.map((att, i) => (
                <a key={i} href={att.url} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                  borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`,
                  textDecoration: 'none', backgroundColor: theme.colors.bgMain, color: theme.colors.textMain
                }}>
                  {att.type === 'LINK' ? <ExternalLink size={16} /> : <Download size={16} />}
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{att.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Conditional Footer: Submission or Feedback */}
        {assignment.status === 'GRADED' && assignment.mySubmission ? (
          <FeedbackView submission={assignment.mySubmission} totalPoints={assignment.pointsTotal} />
        ) : (
          <SubmissionArea assignmentId={assignment.id} isSubmitted={isCompleted} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
}

