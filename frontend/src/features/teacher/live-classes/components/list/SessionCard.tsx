import React from "react";
import { LiveClass } from "@/shared/types/liveClass.types";
import { formatSessionDate, getStatusColor } from "../../utils/timeHelpers";

interface SessionCardProps {
  session: LiveClass;
  onUploadClick: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onUploadClick,
}) => {
  const statusColor = getStatusColor(session.status);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all mb-3 flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex gap-4">
        <div className="text-center bg-gray-50 rounded-lg p-3 min-w-[70px] h-fit">
          <span className="block text-xs font-bold text-gray-500 uppercase">
            {formatSessionDate(session.scheduledAt).split(" ")[0]}
          </span>
          <span className="block text-xl font-bold text-gray-900">
            {formatSessionDate(session.scheduledAt).split(" ")[2]}
          </span>
        </div>
        <div>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
            style={{ color: statusColor, backgroundColor: `${statusColor}15` }}
          >
            {session.status}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {session.title}
          </h3>
          <p className="text-sm text-gray-500">{session.courseName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-center">
        {session.status === "completed" && !session.recordingUrl && (
          <button
            onClick={() => onUploadClick(session.id)}
            className="text-sm text-amber-600 font-medium hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
          >
            + Add Recording
          </button>
        )}
        {session.recordingUrl && (
          <a
            href={session.recordingUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            ▶ Watch Recording
          </a>
        )}
      </div>
    </div>
  );
};
