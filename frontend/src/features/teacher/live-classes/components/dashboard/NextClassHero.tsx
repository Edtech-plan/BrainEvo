import React from "react";
import { LiveSession } from "../../../../../shared/types/live.types";
import { formatSessionTime } from "../../utils/timeHelpers";

export const NextClassHero: React.FC<{ session?: LiveSession }> = ({
  session,
}) => {
  if (!session) return null;

  return (
    <div className="w-full p-6 rounded-2xl mb-8 text-white relative overflow-hidden shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-3">
            UP NEXT
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            {session.topic}
          </h2>
          <p className="text-indigo-100 text-lg">{session.batchName}</p>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium text-indigo-100/90">
            <span>🕒 Starts at {formatSessionTime(session.startTime)}</span>
            <span>•</span>
            <span>⏳ {session.durationMinutes} Mins</span>
          </div>
        </div>
        <button
          onClick={() => window.open(session.meetingLink, "_blank")}
          className="w-full md:w-auto py-3 px-8 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-md"
        >
          Launch Class
        </button>
      </div>
    </div>
  );
};
