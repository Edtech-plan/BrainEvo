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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
    hasMore: boolean;
  } | null>(null);

  const fetchBatches = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const { batches: data, pagination: pag } = await BatchesService.fetchAll(pageNum, 20);
      setBatches((prev) => (append ? [...prev, ...data] : data));
      setPagination(
        pag
          ? { total: pag.total, totalPages: pag.totalPages, hasMore: pag.hasMore }
          : null
      );
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load batches");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (pagination?.hasMore) fetchBatches(page + 1, true);
  }, [page, pagination?.hasMore, fetchBatches]);

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
    fetchBatches(1);
  }, [fetchBatches]);
  return {
    batches,
    loading,
    error,
    refetch: () => fetchBatches(page),
    createBatch,
    pagination,
    loadMore,
  };
};
