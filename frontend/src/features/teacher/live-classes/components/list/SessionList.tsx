import React from "react";
import { LiveSession } from "../../../../../shared/types/live.types";
import { SessionCard } from "./SessionCard";
import { EmptyState } from "./EmptyState";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  onUploadClick: (id: string) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  isLoading,
  onUploadClick,
}) => {
  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400">Loading schedule...</div>
    );
  if (sessions.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col">
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onUploadClick={onUploadClick} />
      ))}
    </div>
  );
};
