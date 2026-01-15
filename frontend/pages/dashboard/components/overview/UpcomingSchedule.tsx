function UpcomingSchedule() {
  const events = [
    { title: 'Live Class: React Hooks', time: 'Today, 6:00 PM' },
    { title: 'Assignment Deadline', time: 'Tomorrow, 11:59 PM' },
    { title: 'Live Class: API Integration', time: 'Mar 20, 6:00 PM' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upcoming Schedule
      </h2>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full" />
            <div>
              <p className="font-medium text-gray-900">{event.title}</p>
              <p className="text-sm text-gray-600">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
        View Calendar
      </button>
    </div>
  );
}

export default UpcomingSchedule;
