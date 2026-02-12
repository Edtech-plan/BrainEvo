import { useState, useEffect, useCallback } from "react";
import {
  Batch,
  CreateBatchPayload,
} from "../../../../shared/types/batch.types";
import { BatchesService } from "../services/batches.service";

export const useBatches = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BatchesService.fetchAll();
      setBatches(data);
    } catch (err) {
      setError("Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, []);

  const createBatch = async (payload: CreateBatchPayload) => {
    try {
      setLoading(true);
      const newBatch = await BatchesService.create(payload);
      setBatches((prev) => [newBatch, ...prev]);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);
  return { batches, loading, error, refetch: fetchBatches, createBatch };
};
