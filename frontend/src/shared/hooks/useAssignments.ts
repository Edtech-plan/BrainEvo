import { useState, useEffect } from 'react';
import assignmentService from '../../modules/assignment/assignment.service';

/**
 * Assignments Hook
 */
export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await assignmentService.getAssignments();
      if (response.success) {
        setAssignments(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async (assignmentData: any) => {
    try {
      const response = await assignmentService.createAssignment(assignmentData);
      if (response.success) {
        await fetchAssignments();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create assignment');
    }
  };

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    createAssignment,
  };
};
