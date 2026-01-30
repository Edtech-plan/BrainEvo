export type AssignmentStatus = 'PENDING' | 'OVERDUE' | 'SUBMITTED' | 'GRADED';

export interface AssignmentAttachment {
  name: string;
  url: string;
  type: 'PDF' | 'LINK' | 'ZIP' | 'IMAGE';
}

export interface Submission {
  id: string;
  assignmentId: string;
  submittedAt: string;
  fileUrl?: string;
  linkUrl?: string;
  grade?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  instructorName: string;
  description: string;
  dueDate: string; // ISO string
  pointsTotal: number;
  status: AssignmentStatus;
  attachments?: AssignmentAttachment[];
  mySubmission?: Submission;
}
