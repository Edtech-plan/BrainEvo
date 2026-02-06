import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import { Submission } from '@/shared/types/assignment.types'; // Fixed Import Path
import { Award, MessageCircle } from 'lucide-react';

interface FeedBackProps {
  submission: Submission;
  totalPoints: number;
}

export default function FeedbackView({ submission, totalPoints }: FeedBackProps) {
  return (
    <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '40px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ 
          width: '200px', padding: '24px', borderRadius: theme.borderRadius.lg, 
          backgroundColor: theme.colors.successBg, border: `1px solid #bbf7d0`, textAlign: 'center' 
        }}>
          <Award size={32} color={theme.colors.success} style={{ margin: '0 auto 8px' }} />
          <span style={{ display: 'block', fontSize: '32px', fontWeight: 800, color: theme.colors.success }}>
            {/* Fix: Added Fallback */}
            {submission.grade ?? '—'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.textSecondary }}>out of {totalPoints}</span>
        </div>

        <div style={{ flex: 1, padding: '24px', borderRadius: theme.borderRadius.lg, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.bgMain }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: theme.colors.textMain }}>
            <MessageCircle size={18} />
            <span style={{ fontWeight: 700 }}>Instructor Feedback</span>
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: theme.colors.textSecondary, lineHeight: '1.6', fontStyle: 'italic' }}>
            {/* Fix: Added Fallback */}
            "{submission.feedback ?? 'No feedback provided.'}"
          </p>
        </div>
      </div>
    </div>
  );
}
