/**
 * Live Class Types
 */

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration?: number; // Duration in minutes
  meetingLink: string;
  courseId?: string;
  instructor?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLiveClassData {
  title: string;
  scheduledAt: string;
  meetingLink: string;
  courseId?: string;
}

export interface UpdateLiveClassData {
  title?: string;
  scheduledAt?: string;
  meetingLink?: string;
  courseId?: string;
}
