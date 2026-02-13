/**
 * LiveClassesDashboard Container
 * ------------------------------------------------
 * The root component for the Teacher Live Studio feature.
 *
 * Responsibilities:
 * 1. Data Fetching: Uses custom hooks to load sessions and stats.
 * 2. State Management: Manages search queries, filters, and modal visibility.
 * 3. Logic: Filters the session list in real-time using `useMemo`.
 * 4. Error Handling: Coordinates error states between hooks and UI modals.
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
  // --- Custom Hooks ---
  const { sessions, loading, error, refresh } = useLiveSessions();
  const stats = useSessionStats(sessions);

  // Destructure actions and error state from the mutation hook
  const {
    createSession,
    uploadRecording,
    isSubmitting,
    actionError,
    resetError,
  } = useSessionActions(refresh);

  // --- Local State ---
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");

  // Modal control state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  /**
   * Filter Logic:
   * Optimized with useMemo to prevent re-calculations on every render.
   * Filters by Topic (Search) AND Batch Name (Dropdown).
   */
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // 1. Search Logic (Case insensitive)
      const matchesSearch = session.topic
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 2. Batch Filter Logic
      const matchesBatch =
        selectedBatch === "all" || session.batchName === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  }, [sessions, searchQuery, selectedBatch]);

  // Identify the immediate next class for the Hero Widget
  const nextSession = sessions.find(
    (s) => s.status === "scheduled" || s.status === "live",
  );

  // Opens the upload modal for a specific session ID
  const handleUploadClick = (id: string) => {
    setSelectedSessionId(id);
    setShowUploadModal(true);
  };

  /**
   * Helper to reset the UI state.
   * Closes all modals and clears any API errors from previous attempts.
   */
  const handleCloseModals = () => {
    setShowScheduleModal(false);
    setShowUploadModal(false);
    resetError(); // Critical: Clear errors so they don't persist on next open
  };

  return (
    // FIX: Removed 'min-h-screen bg-gray-50/50' and 'max-w-6xl mx-auto' to match Dashboard layout
    <div className="w-full font-sans text-gray-900 space-y-8">
      {/* --- Header Section --- */}
      <LiveClassHeader onScheduleClick={() => setShowScheduleModal(true)} />

      {/* --- Stats Overview --- */}
      <LiveStats stats={stats} />

      {/* --- Hero Section (Only shows if data loaded & class exists) --- */}
      {!loading && nextSession && <NextClassHero session={nextSession} />}

      {/* --- Main List Area --- */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            All Sessions ({filteredSessions.length})
          </h2>
        </div>

        {/* Filter Controls */}
        <QuickFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
        />

        {/* Global Fetch Error (e.g., Network Down) */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Filtered List */}
        <SessionList
          sessions={filteredSessions}
          isLoading={loading}
          onUploadClick={handleUploadClick}
        />
      </div>

      {/* --- MODAL: Schedule New Class --- */}
      <CreateSessionModal
        isOpen={showScheduleModal}
        onClose={handleCloseModals}
        isSubmitting={isSubmitting}
        error={actionError} // Pass error state to modal
        onSubmit={async (data) => {
          try {
            await createSession(data);
            handleCloseModals(); // Close only on success
          } catch (e) {
            // Error is handled in hook & passed via `actionError`
          }
        }}
      />

      {/* --- MODAL: Add Recording --- */}
      <RecordUploadModal
        isOpen={showUploadModal}
        onClose={handleCloseModals}
        isSubmitting={isSubmitting}
        error={actionError} // Pass error state to modal
        onSubmit={async (url) => {
          if (selectedSessionId) {
            try {
              await uploadRecording(selectedSessionId, url);
              handleCloseModals(); // Close only on success
            } catch (e) {
              // Error is handled in hook & passed via `actionError`
            }
          }
        }}
      />
    </div>
  );
};

export default LiveClassesDashboard;
