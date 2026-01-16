function UpcomingSchedule() {
  const events = [
    { title: 'Live Class: React Hooks', time: 'Today, 6:00 PM', type: 'class' },
    { title: 'Assignment Deadline', time: 'Tomorrow, 11:59 PM', type: 'deadline' },
    { title: 'Live Class: API Integration', time: 'Mar 20, 6:00 PM', type: 'class' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Upcoming Schedule</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View Calendar
        </button>
      </div>

      <div className="space-y-3 flex-grow">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-default"
          >
            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0
              ${event.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`} 
            />
            <div>
              <p className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                {event.title}
              </p>
              <p className="text-xs text-slate-500">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpcomingSchedule;
