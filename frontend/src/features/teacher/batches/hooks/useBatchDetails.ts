import { useState, useEffect, useCallback } from "react";
import { Batch, BatchStats } from "../../../../shared/types/batch.types";
import { BatchesService } from "../services/batches.service";

export const useBatchDetails = (batchId: string) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!batchId) return;
    setLoading(true);
    Promise.all([
      BatchesService.fetchById(batchId),
      BatchesService.fetchStats(batchId),
    ])
      .then(([b, s]) => {
        setBatch(b);
        setStats(s);
      })
      .catch(() => {
        console.error("Failed to load details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [batchId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { batch, stats, loading, refetch };
};
