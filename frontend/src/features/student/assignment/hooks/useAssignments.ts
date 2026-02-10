import { useState, useEffect, useMemo } from 'react';
import assignmentService from '../services/assignment.service';
import { Assignment } from '../../../../shared/types/assignment.types';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch {
      setError('Unable to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (id: string, payload: { file?: File; link?: string }) => {
    try {
      setSubmitting(true);
      await assignmentService.submitWork(id, payload);
      await fetchData(); // Refresh list after submission
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    if (filter === 'ALL') return assignments;
    if (filter === 'PENDING') return assignments.filter(a => a.status === 'PENDING' || a.status === 'OVERDUE');
    return assignments.filter(a => a.status === 'GRADED' || a.status === 'SUBMITTED');
  }, [assignments, filter]);

  return {
    assignments: filteredData,
    loading,
    submitting,
    error,
    filter,
    setFilter,
    submitAssignment,
    refresh: fetchData
  };
};
