// UpcomingClasses.tsx
import React from 'react';
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";
// Importing theme just in case we need it for future extensions, 
// though ClassCard handles most styling here.

function UpcomingClasses() {
  const classes = [
    {
      title: 'Database Optimization',
      teacher: 'John Doe',
      time: 'Mar 20, 6:00 PM',
    },
    {
      title: 'System Design Basics',
      teacher: 'Jane Smith',
      time: 'Mar 22, 7:00 PM',
    },
  ];

  return (
    <div>
      <SectionHeader title="Upcoming Classes" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
