import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';
import { StatCard } from '../../../../src/shared/components/ui';

function OverviewStats() {
  const stats = [
    {
      label: 'Attendance Rate',
      value: '92%',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Live Classes Attended',
      value: '18 / 20',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Assignments Completed',
      value: '85%',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Overall Performance',
      value: '88%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
