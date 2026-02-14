/**
 * BatchesList Container
 * ------------------------------------------------
 * The main dashboard view for the Batches feature.
 *
 * Responsibilities:
 * 1. Displays the grid of active cohorts/batches.
 * 2. Manages the "Create Batch" modal state.
 * 3. Handles loading and error states for batch data.
 * 4. Layout: Full-width container matching the standard Dashboard style.
 */

import React, { useState } from "react";
import { Plus, AlertCircle, RefreshCcw } from "lucide-react";
import { useBatches } from "../hooks/useBatches";
import { BatchGrid } from "./list/BatchGrid";
import { CreateBatchModal } from "./list/CreateBatchModal";
import { theme } from "../../../../shared/components/ui/theme";

interface BatchesListProps {
  onSelectBatch: (id: string) => void;
}

export const BatchesList: React.FC<BatchesListProps> = ({ onSelectBatch }) => {
  const { batches, loading, error, refetch, createBatch, pagination, loadMore } = useBatches();
  const [modalOpen, setModalOpen] = useState(false);

  // --- Error State View ---
  if (error) {
    return (
      <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <div
          className="p-4 rounded-full mb-4"
          style={{
            backgroundColor: theme.colors.errorBg,
            color: theme.colors.error,
          }}
        >
          <AlertCircle size={32} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ color: theme.colors.textMain }}
        >
          Connection Error
        </h2>
        <p
          className="mb-6 max-w-xs mx-auto"
          style={{ color: theme.colors.textSecondary }}
        >
          {error}. Please check your network.
        </p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition active:scale-95"
          style={{ backgroundColor: theme.colors.primary, color: "#fff" }}
        >
          <RefreshCcw size={18} /> Retry Loading
        </button>
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    // FIX: Removed 'max-w-7xl mx-auto' and padding constraints to fill the DashboardLayout naturally
    <div className="w-full space-y-6">
      {/* Header Section: Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: theme.colors.textMain }}
          >
            My Cohorts
          </h1>
          <p
            className="text-sm md:text-base mt-1"
            style={{ color: theme.colors.textSecondary }}
          >
            Manage classes and curriculum.
          </p>
        </div>

        {/* Create Button (Full width on mobile for better touch target) */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition"
          style={{ backgroundColor: theme.colors.primary, color: "#fff" }}
        >
          <Plus size={20} /> <span>Create New Batch</span>
        </button>
      </div>

      <BatchGrid
        batches={batches}
        loading={loading}
        onSelect={onSelectBatch}
        pagination={pagination}
        onLoadMore={loadMore}
      />
      <CreateBatchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createBatch}
      />
    </div>
  );
};
