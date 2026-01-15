import { useState, useEffect } from 'react';
import assignmentService from '../../modules/assignment/assignment.service';
import type { Assignment, CreateAssignmentData } from '../types';
import type { AppErrorType } from '../types/errors.types';
import { getErrorMessage } from '../types/errors.types';

/**
 * Assignments Hook
 */
export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
    } catch (err: AppErrorType) {
      setError(getErrorMessage(err) || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const createAssignment = async (assignmentData: CreateAssignmentData): Promise<Assignment | undefined> => {
    try {
      const response = await assignmentService.createAssignment(assignmentData);
      if (response.success) {
        await fetchAssignments();
        return response.data;
      }
    } catch (err: AppErrorType) {
      throw new Error(getErrorMessage(err) || 'Failed to create assignment');
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
