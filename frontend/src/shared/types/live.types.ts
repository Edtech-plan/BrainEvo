export type SessionStatus = "scheduled" | "live" | "completed" | "cancelled";

export interface LiveSession {
  id: string;
  batchId: string;
  batchName: string;
  topic: string;
  description: string;

  // Time
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  durationMinutes: number;

  // Integration
  meetingLink: string;

  // Post-Class Assets (Optional)
  recordingUrl?: string;
  notesUrl?: string;

  // Status & Metrics
  status: SessionStatus;
  registeredStudents: number;
  actualAttendance: number;
}

export interface LiveStats {
  totalClasses: number;
  totalHours: number;
  avgAttendancePercentage: number;
}

export interface CreateSessionPayload {
  batchId: string;
  topic: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  meetingLink: string;
}
