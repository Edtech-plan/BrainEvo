import { Send, Search } from 'lucide-react';

function Messages() {
  const notifications = [
    {
      title: 'Assignment Graded',
      message: 'Your Physics Lab Report has been graded. Check your results.',
      time: '10 minutes ago',
      type: 'grade',
      unread: true,
    },
    {
      title: 'New Announcement',
      message: 'Dr. Johnson posted a new announcement in Advanced Mathematics.',
      time: '1 hour ago',
      type: 'announcement',
      unread: true,
    },
    {
      title: 'Upcoming Deadline',
      message: 'Your AI Research Paper is due in 3 days.',
      time: '2 hours ago',
      type: 'deadline',
      unread: false,
    },
    {
      title: 'Course Material Added',
      message: 'New lecture notes available for Computer Science 101.',
      time: '5 hours ago',
      type: 'material',
      unread: false,
    },
    {
      title: 'Study Group Invitation',
      message: 'You have been invited to join the Mathematics Study Group.',
      time: '1 day ago',
      type: 'invitation',
      unread: false,
    },
  ];

  const messages = [
    {
      name: 'Dr. Sarah Johnson',
      message: 'Great work on the last assignment!',
      time: '2h ago',
      avatar: 'SJ',
      unread: true,
    },
    {
      name: 'Study Group',
      message: 'Meeting rescheduled to tomorrow',
      time: '5h ago',
      avatar: 'SG',
      unread: true,
    },
    {
      name: 'Prof. Michael Chen',
      message: 'Please review the lab instructions',
      time: '1d ago',
      avatar: 'MC',
      unread: false,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'grade':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'announcement':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'material':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'invitation':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages & Notifications</h1>
        <p className="text-gray-600">Stay updated with your courses and communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.unread
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Contact Instructor</h3>
                <p className="text-sm text-gray-600">Send a message to your instructors</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Join Discussion</h3>
                <p className="text-sm text-gray-600">Participate in course forums</p>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Messages</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    msg.unread ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{msg.name}</h3>
                        {msg.unread && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              New Message
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Email notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Push notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">Deadline reminders</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
