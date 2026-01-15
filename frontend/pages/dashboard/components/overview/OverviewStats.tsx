import { Clock, TrendingUp, BookOpen, Award } from 'lucide-react';

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
        <div
          key={index}
          className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div
            className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}
          >
            {stat.icon}
          </div>
          <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default OverviewStats;
