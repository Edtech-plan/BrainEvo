/**
 * LiveClassesDashboard Container
 * ------------------------------------------------
 * The root component for the Teacher Live Studio feature.
 * Updated to use unified `LiveClass` types.
 */

import React, { useState, useMemo } from "react";
import {
  LiveClassHeader,
  LiveStats,
  NextClassHero,
  QuickFilters,
  SessionList,
  CreateSessionModal,
  RecordUploadModal,
} from "./components";
import { useLiveSessions } from "./hooks/useLiveSessions";
import { useSessionStats } from "./hooks/useSessionStats";
import { useSessionActions } from "./hooks/useSessionActions";

const LiveClassesDashboard: React.FC = () => {
  const { sessions, loading, error, refresh } = useLiveSessions();
  const stats = useSessionStats(sessions);

  const {
    createSession,
    uploadRecording,
    isSubmitting,
    actionError,
    resetError,
  } = useSessionActions(refresh);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  /**
   * Filter Logic (Updated for new schema)
   * Uses 'title' instead of 'topic' and 'courseName' for batch filtering.
   */
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch = session.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesBatch =
        selectedBatch === "all" || session.courseName === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [sessions, searchQuery, selectedBatch]);

  const nextSession = sessions.find(
    (s) => s.status === "scheduled" || s.status === "live",
  );

  // Handlers
  const handleOpenScheduleModal = () => setScheduleModalOpen(true);

  const handleOpenUploadModal = (id: string) => {
    setSelectedSessionId(id);
    setUploadModalOpen(true);
  };

  const handleCloseModals = () => {
    setScheduleModalOpen(false);
    setUploadModalOpen(false);
    resetError();
  };

  const handleCreateSession = async (data: any) => {
    try {
      await createSession(data);
      handleCloseModals();
    } catch (e) {
      // Error handled in hook
    }
  };

  const handleUploadRecording = async (url: string) => {
    if (selectedSessionId) {
      try {
        await uploadRecording(selectedSessionId, url);
        handleCloseModals();
      } catch (e) {
        // Error handled in hook
      }
    }
  };

  return (
    <div className="w-full font-sans text-gray-900 space-y-8">
      <LiveClassHeader onScheduleClick={handleOpenScheduleModal} />

      <LiveStats stats={stats} />

      {!loading && nextSession && <NextClassHero session={nextSession} />}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            All Sessions ({filteredSessions.length})
          </h2>
        </div>

        <QuickFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <SessionList
          sessions={filteredSessions}
          isLoading={loading}
          onUploadClick={handleOpenUploadModal}
        />
      </div>

      <CreateSessionModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseModals}
        isSubmitting={isSubmitting}
        error={actionError}
        onSubmit={handleCreateSession}
      />

      <RecordUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModals}
        isSubmitting={isSubmitting}
        error={actionError}
        onSubmit={handleUploadRecording}
      />
    </div>
  );
};

export default LiveClassesDashboard;
