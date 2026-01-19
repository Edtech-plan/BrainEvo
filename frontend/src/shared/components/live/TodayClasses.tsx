import React from 'react';
import AttendanceBadge from "../../../../src/shared/components/live/AttendanceBadge";
import ClassCard from "../../../../src/shared/components/live/ClassCard";
import SectionHeader from "../../../../src/shared/components/live/SectionHeader";

interface TodayClass {
  title: string;
  teacher: string;
  time: string;
  attendance: 'Present' | 'Late' | 'Absent' | null;
}

function TodayClasses() {
  const classes: TodayClass[] = [
    { title: 'React State Management', teacher: 'John Doe', time: '6:00 PM – 7:00 PM', attendance: 'Present' },
    { title: 'Backend API Design', teacher: 'Jane Smith', time: '8:00 PM – 9:00 PM', attendance: null },
  ];

  const gridStyle = `
    .today-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .today-grid { grid-template-columns: 1fr 1fr; } }
  `;

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{gridStyle}</style>
      <SectionHeader title="Today’s Classes" />
      <div className="today-grid">
        {classes.map((cls, index) => (
          <ClassCard key={index} title={cls.title} teacher={cls.teacher} time={cls.time}>
            {cls.attendance && <AttendanceBadge status={cls.attendance} />}
            {!cls.attendance && (
               <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Scheduled</div>
            )}
          </ClassCard>
        ))}
      </div>
    </div>
  );
}

export default TodayClasses;
