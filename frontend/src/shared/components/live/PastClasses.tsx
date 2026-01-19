import React from 'react';
import { theme } from '../ui/theme';
import AttendanceBadge from "../../../../src/shared/components/live/AttendanceBadge";
import ClassCard from "../../../../src/shared/components/live/ClassCard";
import SectionHeader from "../../../../src/shared/components/live/SectionHeader";

interface PastClass {
  title: string;
  teacher: string;
  time: string;
  attendance: 'Present' | 'Late' | 'Absent';
  assignment: boolean;
}

function PastClasses() {
  const classes: PastClass[] = [
    { title: 'Intro to Node.js', teacher: 'John Doe', time: 'Mar 10, 6:00 PM', attendance: 'Late', assignment: true },
    { title: 'Git & Version Control', teacher: 'Jane Smith', time: 'Mar 8, 7:00 PM', attendance: 'Absent', assignment: false },
  ];

  const gridStyle = `
    .past-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .past-grid { grid-template-columns: 1fr 1fr; } }
  `;

  return (
    <div>
      <style>{gridStyle}</style>
      <SectionHeader title="Past Classes" />
      <div className="past-grid">
        {classes.map((cls, index) => (
          <ClassCard key={index} title={cls.title} teacher={cls.teacher} time={cls.time}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <AttendanceBadge status={cls.attendance} />
              {cls.assignment && (
                <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.primary }}>
                  Assignment Created
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
