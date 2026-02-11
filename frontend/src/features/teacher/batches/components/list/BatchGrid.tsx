import React from "react";
import { BatchCard } from "./BatchCard";
import { Batch } from "../../../../../shared/types/batch.types";
import { theme } from "../../../../../shared/components/ui/theme";

export const BatchGrid = ({
  batches,
  loading,
  onSelect,
}: {
  batches: Batch[];
  loading: boolean;
  onSelect: (id: string) => void;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {batches.map((b) => (
        <BatchCard key={b.id} batch={b} onClick={onSelect} />
      ))}
    </div>
  );
};
