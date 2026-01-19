import React from 'react';
import ClassCard from "../../../../src/shared/components/live/ClassCard";
import SectionHeader from "../../../../src/shared/components/live/SectionHeader";

function UpcomingClasses() {
  const classes = [
    { title: 'Database Optimization', teacher: 'John Doe', time: 'Mar 20, 6:00 PM' },
    { title: 'System Design Basics', teacher: 'Jane Smith', time: 'Mar 22, 7:00 PM' },
  ];

  const gridStyle = `
    .upcoming-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .upcoming-grid { grid-template-columns: 1fr 1fr; } }
  `;

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{gridStyle}</style>
      <SectionHeader title="Upcoming Classes" />
      <div className="upcoming-grid">
        {classes.map((cls, index) => (
          <ClassCard
            key={index}
            title={cls.title}
            teacher={cls.teacher}
            time={cls.time}
            status="Upcoming"
          />
        ))}
      </div>
    </div>
  );
}

export default UpcomingClasses;
