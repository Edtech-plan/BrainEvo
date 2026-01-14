import { Search, Filter, Play } from 'lucide-react';
import Image from 'next/image';

function MyLearning() {
  const courses = [
    {
      title: 'Advanced Mathematics',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      thumbnail: '/logo1.png',
      category: 'Mathematics',
    },
    {
      title: 'Physics Fundamentals',
      instructor: 'Prof. Michael Chen',
      progress: 60,
      totalLessons: 30,
      completedLessons: 18,
      thumbnail: '/logo1.png',
      category: 'Science',
    },
    {
      title: 'Computer Science 101',
      instructor: 'Dr. Emily Rodriguez',
      progress: 90,
      totalLessons: 20,
      completedLessons: 18,
      thumbnail: '/logo1.png',
      category: 'Technology',
    },
    {
      title: 'Creative Writing',
      instructor: 'James Williams',
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      thumbnail: '/logo1.png',
      category: 'Arts',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
        <p className="text-gray-600">Track your courses and continue learning</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-200">
              <Image
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white text-gray-900 rounded-full p-4 hover:scale-110 transition-transform">
                  <Play className="w-6 h-6" fill="currentColor" />
                </button>
              </div>
              <span className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                {course.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{course.instructor}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {course.completedLessons} of {course.totalLessons} lessons
                  </span>
                  <span className="font-semibold text-gray-900">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyLearning;
