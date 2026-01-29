import apiClient from '@/shared/lib/axios'; // Using BrainEvo's centralized axios instance
import { Assignment, Submission } from '../../../shared/types/assignment.types';

class AssignmentService {
  /**
   * Fetches all assignments for the logged-in student.
   * Note: In production, the backend handles filtering. For the prototype, 
   * we use a mock delay to simulate network latency.
   */
  async getAssignments(): Promise<Assignment[]> {
    // Simulated API Call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'asgn_1',
            title: 'Advanced React Patterns',
            subject: 'Frontend Development',
            instructorName: 'John Doe',
            description: 'Implement a compound component pattern for a custom dropdown menu. Ensure accessibility standards are met.',
            dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
            pointsTotal: 100,
            status: 'PENDING',
            attachments: [{ name: 'Starter_Code.zip', url: '#', type: 'ZIP' }]
          },
          {
            id: 'asgn_2',
            title: 'Database Normalization Task',
            subject: 'Backend Engineering',
            instructorName: 'Kush Kore',
            description: 'Normalize the provided unnormalized table to 3NF. Provide the ER diagram.',
            dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            pointsTotal: 50,
            status: 'OVERDUE',
          },
          {
            id: 'asgn_3',
            title: 'Intro to TypeScript',
            subject: 'Web Development',
            instructorName: 'John Doe',
            description: 'Convert the existing JS project to TS using strict mode.',
            dueDate: new Date(Date.now() - 604800000).toISOString(),
            pointsTotal: 100,
            status: 'GRADED',
            mySubmission: {
              id: 'sub_1',
              assignmentId: 'asgn_3',
              submittedAt: new Date(Date.now() - 700000000).toISOString(),
              grade: 95,
              feedback: 'Excellent type definitions. Very clean code structure!'
            }
          }
        ]);
      }, 800);
    });
  }

  async submitWork(assignmentId: string, data: { file?: File, link?: string }): Promise<boolean> {
    // In production: const response = await apiClient.post(`/assignments/${assignmentId}/submit`, data);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1200);
    });
  }
}

export default new AssignmentService();
