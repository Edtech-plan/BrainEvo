/**
 * Live Class Unified Type Definitions
 * ------------------------------------------------
 * This file consolidates the data models for both the Student and Teacher
 * Live Class features. It ensures a consistent contract across the application.
 *
 * @interface LiveClass - Represents a single live session entity.
 * @interface CreateLiveClassPayload - Payload for creating a new session.
 * @interface LiveStats - Metrics for the teacher dashboard.
 */

export type SessionStatus = "scheduled" | "live" | "completed" | "cancelled";

export type AttendanceStatus = "Present" | "Late" | "Absent";

export interface LiveClass {
  id: string;

  // Core Details
  title: string; // Replaces 'topic'
  description?: string;
  meetingLink: string;

  // Timing
  scheduledAt: string; // Replaces 'startTime' (ISO 8601 string)
  duration: number; // Replaces 'durationMinutes' (in minutes)

  // Context (Batch/Course Association)
  courseId: string; // Replaces 'batchId'
  courseName?: string; // Replaces 'batchName' (Optional display name)

  // Status & Post-Class Assets
  status: SessionStatus;
  recordingUrl?: string;
  notesUrl?: string;

  // Analytics (Teacher View Only)
  registeredStudents?: number;
  actualAttendance?: number;

  // Legacy/Student-View Fields (Optional compatibility)
  instructor?: {
    id: string;
    name: string;
    email?: string;
  };
  attendanceStatus?: AttendanceStatus; // Student attendance record for this session
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for scheduling a new class (Teacher Dashboard)
 */
export interface CreateLiveClassPayload {
  courseId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
}

/**
 * Dashboard Metrics (Teacher View Only)
 */
export interface LiveStats {
  totalClasses: number;
  totalHours: number;
  avgAttendancePercentage: number;
}
