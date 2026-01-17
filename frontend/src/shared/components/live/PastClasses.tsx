// PastClasses.tsx
import React from 'react';
import AttendanceBadge from "@/shared/components/live/AttendanceBadge";
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";
import { theme } from '@/shared/components/ui/theme';

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

interface PastClass {
  title: string;
  teacher: string;
  time: string;
  attendance: AttendanceStatus;
  assignment: boolean;
}

function PastClasses() {
  const classes: PastClass[] = [
    {
      title: 'Intro to Node.js',
      teacher: 'John Doe',
      time: 'Mar 10, 6:00 PM',
      attendance: 'Late',
      assignment: true,
    },
    {
      title: 'Git & Version Control',
      teacher: 'Jane Smith',
      time: 'Mar 8, 7:00 PM',
      attendance: 'Absent',
      assignment: false,
    },
  ];

  return (
    <div>
      <SectionHeader title="Past Classes" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls, index) => (
          <ClassCard
            key={index}
            title={cls.title}
            teacher={cls.teacher}
            time={cls.time}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: '12px', 
              paddingTop: '12px', 
              borderTop: `1px solid ${theme.colors.bgMain}` 
            }}>
              <AttendanceBadge status={cls.attendance} />
              {cls.assignment && (
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: theme.colors.primary, 
                  backgroundColor: theme.colors.primaryLight, 
                  padding: '4px 8px', 
                  borderRadius: theme.borderRadius.md 
                }}>
                  Assignment
                </span>
              )}
            </div>
          </ClassCard>
        ))}
      </div>
    </div>
  );
}

export default PastClasses;
