import AttendanceBadge from "@/shared/components/live/AttendanceBadge";
import ClassCard from "@/shared/components/live/ClassCard";
import SectionHeader from "@/shared/components/live/SectionHeader";


type AttendanceStatus = 'Present' | 'Late' | 'Absent';

interface TodayClass {
  title: string;
  teacher: string;
  time: string;
  attendance: AttendanceStatus | null;
}

function TodayClasses() {
  const classes: TodayClass[] = [
    {
      title: 'React State Management',
      teacher: 'John Doe',
      time: '6:00 PM – 7:00 PM',
      attendance: 'Present',
    },
    {
      title: 'Backend API Design',
      teacher: 'Jane Smith',
      time: '8:00 PM – 9:00 PM',
      attendance: null,
    },
  ];

  return (
    <div>
      <SectionHeader title="Today’s Schedule" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classes.map((cls, index) => (
          <ClassCard
            key={index}
            title={cls.title}
            teacher={cls.teacher}
            time={cls.time}
          >
            {cls.attendance ? (
              <div className="flex justify-end">
                <AttendanceBadge status={cls.attendance} />
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">
                Scheduled
              </div>
            )}
          </ClassCard>
        ))}
      </div>
    </div>
  );
}

export default TodayClasses;
