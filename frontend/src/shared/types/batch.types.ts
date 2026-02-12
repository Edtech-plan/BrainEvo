export type BatchStatus = "active" | "archived" | "draft";
export type StudentStatus = "active" | "at_risk" | "inactive";
export type ResourceType = "pdf" | "video" | "link" | "assignment";

// New Structured Schedule
export interface BatchSchedule {
  days: string[]; // e.g. ["Mon", "Wed", "Fri"]
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "11:30"
}

export interface Batch {
  id: string;
  name: string;
  schedule: BatchSchedule; // UPDATED: No longer a string
  startDate: string; // ISO Date YYYY-MM-DD
  studentCount: number;
  status: BatchStatus;
}

export interface BatchStudent {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  attendanceRate: number;
  status: StudentStatus;
}

export interface BatchResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  size?: string;
  uploadDate: string;
  isPublished: boolean;
}

export interface BatchStats {
  avgAttendance: number;
  avgPerformance: number;
}

export interface CreateBatchPayload {
  name: string;
  schedule: BatchSchedule; // UPDATED
  startDate: string;
}
