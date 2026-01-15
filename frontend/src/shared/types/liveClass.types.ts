/**
 * Live Class Types
 */

export interface LiveClass {
  id: string;
  title: string;
  scheduledAt: string;
  meetingLink: string;
  courseId?: string;
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
