import React from 'react';
import { theme } from '@/shared/components/ui/theme';
import ActionButton from './ActionButton';
import { Clock, User, Signal } from 'lucide-react';
import { useLiveClasses } from '../hooks/useLiveClasses';

function OngoingClass() {
  const { ongoingClasses, loading } = useLiveClasses();

  const css = `
    .ongoing-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .thumbnail-container {
      width: 100%;
      height: 160px;
      flex-shrink: 0;
    }

    .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      margin-top: 12px;
      margin-bottom: 20px;
    }

    @media (min-width: 768px) {
      .ongoing-card {
        flex-direction: row;
        align-items: stretch;
      }

      .thumbnail-container {
        width: 200px;
        height: auto;
        min-height: 140px;
      }

      .content-container {
        padding-right: 10px;
      }
    }
  `;

  if (loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 700,
          color: theme.colors.textMain,
          marginBottom: '16px',
          height: '24px',
          width: '200px',
          backgroundColor: theme.colors.bgHover,
          borderRadius: '4px'
        }} />
        <div style={{
          backgroundColor: theme.colors.bgSurface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: '20px',
          boxShadow: theme.shadows.sm,
          minHeight: '200px'
        }} />
      </div>
    );
  }

  if (ongoingClasses.length === 0) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: theme.colors.textMain,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: theme.colors.bgHover
          }}>
            <Signal size={14} color={theme.colors.textSecondary} />
          </span>
          Ongoing Session
        </h2>
        <div style={{
          backgroundColor: theme.colors.bgSurface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: '24px',
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontStyle: 'italic'
        }}>
          No ongoing classes at the moment
        </div>
      </div>
    );
  }

  const liveClass = ongoingClasses[0];
  const scheduledAt = new Date(liveClass.scheduledAt);

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{css}</style>

      <h2 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: theme.colors.textMain,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#fee2e2'
        }}>
          <Signal size={14} color="#ef4444" />
        </span>
        Ongoing Session
      </h2>

      <div style={{
        backgroundColor: '#fff',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: '20px',
        boxShadow: theme.shadows.sm,
      }} className="ongoing-card">

        <div className="thumbnail-container" style={{
          backgroundColor: '#1e293b',
          borderRadius: theme.borderRadius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
           <div style={{ textAlign: 'center' }}>
             <div style={{
               width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)',
               borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
               margin: '0 auto 8px auto', backdropFilter: 'blur(4px)'
             }}>
                <Signal size={24} color="#fff" />
             </div>
             <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>LIVE FEED</span>
           </div>
        </div>

        <div className="content-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
             <div>
               <h3 style={{
                 fontSize: '24px',
                 fontWeight: 700,
                 color: theme.colors.textMain,
                 margin: '0 0 8px 0',
                 lineHeight: 1.2
               }}>
                 {liveClass.title}
               </h3>
               <p style={{ margin: 0, fontSize: '14px', color: theme.colors.textSecondary }}>
                 {liveClass.courseId || 'Live Class'}
               </p>
             </div>

             <div style={{
               padding: '4px 10px',
               backgroundColor: '#fef2f2',
               border: '1px solid #fecaca',
               borderRadius: '20px',
               color: '#ef4444',
               fontSize: '11px',
               fontWeight: 700,
               textTransform: 'uppercase',
               letterSpacing: '0.05em',
               whiteSpace: 'nowrap',
               display: 'flex',
               alignItems: 'center',
               gap: '6px'
             }}>
               <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
               Live
             </div>
          </div>

          <div className="meta-row">
            {liveClass.instructor && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ padding: '6px', backgroundColor: theme.colors.bgMain, borderRadius: '50%' }}>
                     <User size={14} color={theme.colors.textSecondary} />
                   </div>
                   <span style={{ fontSize: '14px', color: theme.colors.textMain, fontWeight: 500 }}>{liveClass.instructor.name}</span>
                </div>
                <div style={{ width: '1px', height: '16px', backgroundColor: theme.colors.border }} />
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <div style={{ padding: '6px', backgroundColor: theme.colors.bgMain, borderRadius: '50%' }}>
                 <Clock size={14} color={theme.colors.textSecondary} />
               </div>
               <span style={{ fontSize: '14px', color: theme.colors.textMain, fontWeight: 500 }}>
                 Started at {scheduledAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
               </span>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
            <ActionButton
              label="Join Class Now"
              onClick={() => window.open(liveClass.meetingLink, '_blank')}
              style={{ width: 'auto', padding: '10px 24px', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OngoingClass;
