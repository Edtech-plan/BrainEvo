import { StatCard } from '@/shared/components/ui';
import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';


function OverviewStats() {
  const stats = [
    {
      label: 'Attendance Rate',
      value: '92%',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Live Classes',
      value: '18 / 20',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Assignments',
      value: '85%',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Performance',
      value: '88%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

export default OverviewStats;
