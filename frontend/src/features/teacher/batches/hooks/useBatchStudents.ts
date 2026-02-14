import { useState, useEffect, useCallback } from "react";
import { BatchStudent } from "../../../../shared/types/batch.types";
import { BatchesService } from "../services/batches.service";

export const useBatchStudents = (batchId: string) => {
  const [students, setStudents] = useState<BatchStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!batchId) return;
    setLoading(true);
    BatchesService.fetchStudents(batchId)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [batchId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addStudent = async (studentId: string) => {
    const newStudent = await BatchesService.addStudent(batchId, studentId);
    setStudents((prev) => [...prev, newStudent]);
  };

  const removeStudent = async (studentId: string) => {
    await BatchesService.removeStudent(batchId, studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  return { students, loading, refetch, addStudent, removeStudent };
};
