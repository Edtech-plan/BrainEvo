import React from "react";
import { LiveStats as StatsType } from "@/shared/types/liveClass.types";

export const LiveStats: React.FC<{ stats: StatsType }> = ({ stats }) => {
  const cards = [
    {
      label: "Total Classes",
      val: stats.totalClasses,
      sub: "This Month",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Hours Taught",
      val: `${stats.totalHours}h`,
      sub: "Live Time",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
    {
      label: "Avg. Attendance",
      val: `${stats.avgAttendancePercentage}%`,
      sub: "Engagement",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl border border-gray-100 shadow-sm bg-white flex justify-between items-center`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{c.val}</p>
            <span className="text-xs text-gray-400">{c.sub}</span>
          </div>
          
        </div>
      ))}
    </div>
  );
};
