import { useState, useEffect } from "react";
import { BatchStudent } from "../../../../shared/types/batch.types";
import { BatchesService } from "../services/batches.service";

export const useBatchStudents = (batchId: string) => {
  const [students, setStudents] = useState<BatchStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) return;
    BatchesService.fetchStudents(batchId)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [batchId]);

  return { students, loading };
};
