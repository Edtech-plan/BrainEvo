import { TrendingUp, BookOpen, Clock, Award } from 'lucide-react';

function Overview() {
  const stats = [
    { label: 'Courses in Progress', value: '4', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Hours Learned', value: '127', icon: <Clock className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
    { label: 'Certificates Earned', value: '8', icon: <Award className="w-6 h-6" />, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Learning Streak', value: '15 days', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-red-50 text-red-600' },
  ];

  const recentCourses = [
    { title: 'Advanced Mathematics', progress: 75, dueDate: 'Mar 20, 2024' },
    { title: 'Physics Fundamentals', progress: 60, dueDate: 'Mar 25, 2024' },
    { title: 'Computer Science 101', progress: 90, dueDate: 'Mar 18, 2024' },
  ];

  const upcomingEvents = [
    { title: 'Math Quiz', date: 'Today, 2:00 PM', type: 'Assessment' },
    { title: 'Physics Lab', date: 'Tomorrow, 10:00 AM', type: 'Lab' },
    { title: 'Project Submission', date: 'Mar 18, 11:59 PM', type: 'Deadline' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's your learning progress overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Courses</h2>
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Due: {course.dueDate}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View All Courses
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Overview;
