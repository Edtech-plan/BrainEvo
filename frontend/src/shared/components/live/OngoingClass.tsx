// OngoingClass.tsx
import React from 'react';
import ActionButton from "@/shared/components/live/ActionButton";
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";
import { theme } from '@/shared/components/ui/theme';

function OngoingClass() {
  const isJoinable = true;

  if (!isJoinable) return null;

  return (
    <div style={{
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.borderRadius.xl, // Matching rounded-2xl
      padding: '4px',
      border: `1px solid ${theme.colors.primary}30` // Slight transparency on border
    }}>
      <div style={{
        backgroundColor: theme.colors.bgSurface,
        padding: '20px',
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.sm
      }}>
        <SectionHeader
          title="Ongoing Class"
          subtitle="Happening right now"
        />
        
        <div className="mt-4">
          <ClassCard
            title="Full Stack Development"
            teacher="John Doe"
            time="Started at 6:00 PM"
            status="Live Now"
            noBorder
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: theme.colors.error, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '0 8px'
              }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: theme.colors.error 
                }} />
                Recording
              </span>
              <div className="w-full sm:w-auto ml-auto">
                <ActionButton label="Join Live Room" />
              </div>
            </div>
          </ClassCard>
        </div>
      </div>
    </div>
  );
}

export default OngoingClass;
