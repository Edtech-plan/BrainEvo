/**
 * Assignment Types
 */

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  dueDate: string;
  courseId?: string;
}

export interface UpdateAssignmentData {
  title?: string;
  description?: string;
  dueDate?: string;
  courseId?: string;
}
