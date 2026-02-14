import React from "react";

interface LiveClassHeaderProps {
  onScheduleClick: () => void;
}

export const LiveClassHeader: React.FC<LiveClassHeaderProps> = ({ onScheduleClick }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Live Studio</h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage your schedule, broadcasts, and recordings.
      </p>
    </div>
    <button
      onClick={onScheduleClick}
      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2"
    >
      <span>+</span> Schedule Class
    </button>
  </div>
);
