import { useState, useEffect } from "react";
import { BatchResource } from "../../../../shared/types/batch.types";
import { BatchesService } from "../services/batches.service";

export const useBatchResources = (batchId: string) => {
  const [resources, setResources] = useState<BatchResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) return;
    loadResources();
  }, [batchId]);

  const loadResources = () => {
    setLoading(true);
    BatchesService.fetchResources(batchId)
      .then(setResources)
      .catch((err) => setError("Failed to load resources"))
      .finally(() => setLoading(false));
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      const newResource = await BatchesService.uploadResource(batchId, file);
      // Optimistically add to list
      setResources((prev) => [newResource, ...prev]);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return { resources, loading, isUploading, error, uploadFile, deleteResource };
};
