import AttendanceBadge from "@/shared/components/live/AttendanceBadge";
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";

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
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
              <AttendanceBadge status={cls.attendance} />
              {cls.assignment && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
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
