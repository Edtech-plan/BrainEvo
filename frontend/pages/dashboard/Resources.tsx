import { FileText, Video, BookOpen, Download, Search, Filter } from 'lucide-react';

function Resources() {
  const resources = [
    {
      title: 'Advanced Calculus Notes',
      type: 'PDF',
      course: 'Mathematics',
      size: '2.4 MB',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-red-50 text-red-600',
      date: 'Mar 10, 2024',
    },
    {
      title: 'Physics Lecture Recording',
      type: 'Video',
      course: 'Physics',
      size: '156 MB',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      date: 'Mar 12, 2024',
    },
    {
      title: 'Programming Guide',
      type: 'PDF',
      course: 'Computer Science',
      size: '5.1 MB',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-50 text-green-600',
      date: 'Mar 8, 2024',
    },
    {
      title: 'Chemistry Lab Manual',
      type: 'PDF',
      course: 'Chemistry',
      size: '8.7 MB',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-yellow-50 text-yellow-600',
      date: 'Mar 5, 2024',
    },
    {
      title: 'English Literature Essays',
      type: 'PDF',
      course: 'English',
      size: '1.9 MB',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-purple-50 text-purple-600',
      date: 'Mar 11, 2024',
    },
    {
      title: 'Biology Presentation',
      type: 'Video',
      course: 'Biology',
      size: '89 MB',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-blue-50 text-blue-600',
      date: 'Mar 9, 2024',
    },
  ];

  const categories = [
    { name: 'All Resources', count: 24 },
    { name: 'PDFs', count: 12 },
    { name: 'Videos', count: 8 },
    { name: 'Presentations', count: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">Access course materials, notes, and study guides</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              index === 0
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center`}>
                {resource.icon}
              </div>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{resource.course}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{resource.type}</span>
                <span>{resource.size}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">{resource.date}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Accessed</h2>
        <div className="space-y-3">
          {resources.slice(0, 3).map((resource, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.course}</p>
              </div>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resources;
