import React from "react";
import { ChevronDown } from "lucide-react";
import { BatchCard } from "./BatchCard";
import { Batch } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../shared/components/ui/theme";

export const BatchGrid = ({
  batches,
  loading,
  onSelect,
  pagination,
  onLoadMore,
}: {
  batches: Batch[];
  loading: boolean;
  onSelect: (id: string) => void;
  pagination?: { total: number; totalPages: number; hasMore: boolean } | null;
  onLoadMore?: () => void;
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-2xl"
            style={{ backgroundColor: theme.colors.bgSurface }}
          />
        ))}
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div
        className="py-24 text-center border-2 border-dashed rounded-2xl"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.bgSurface,
        }}
      >
        <h3
          className="text-lg font-bold"
          style={{ color: theme.colors.textMain }}
        >
          No active batches
        </h3>
        <p className="mt-1" style={{ color: theme.colors.textSecondary }}>
          Create a new cohort to start.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((b) => (
          <BatchCard key={b.id} batch={b} onClick={onSelect} />
        ))}
      </div>
      {pagination?.hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition"
            style={{
              backgroundColor: theme.colors.primaryLight,
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
            }}
          >
            Load More ({pagination.total - batches.length} remaining)
            <ChevronDown size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
