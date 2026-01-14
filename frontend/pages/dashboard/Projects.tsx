import { Plus, MoreVertical, Users, Calendar } from 'lucide-react';

function Projects() {
  const projects = [
    {
      title: 'AI Research Paper',
      course: 'Computer Science',
      status: 'In Progress',
      progress: 65,
      dueDate: 'Mar 25, 2024',
      members: 3,
      color: 'bg-blue-100 border-blue-300',
    },
    {
      title: 'Physics Lab Report',
      course: 'Physics',
      status: 'In Progress',
      progress: 80,
      dueDate: 'Mar 18, 2024',
      members: 2,
      color: 'bg-green-100 border-green-300',
    },
    {
      title: 'Math Problem Set',
      course: 'Mathematics',
      status: 'Review',
      progress: 100,
      dueDate: 'Mar 15, 2024',
      members: 1,
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      title: 'Literature Analysis',
      course: 'English',
      status: 'Not Started',
      progress: 0,
      dueDate: 'Apr 5, 2024',
      members: 4,
      color: 'bg-gray-100 border-gray-300',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Not Started':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your assignments and group projects</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap">
          All Projects
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
          In Progress
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
          Review
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium whitespace-nowrap">
          Completed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className={`bg-white rounded-lg border-2 ${project.color} p-6 hover:shadow-lg transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{project.course}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Due: {project.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{project.members} {project.members === 1 ? 'member' : 'members'}</span>
              </div>
            </div>

            {project.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
