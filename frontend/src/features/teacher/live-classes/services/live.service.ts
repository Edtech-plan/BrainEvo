/**
 * Live Class Service (Mock Layer)
 * -------------------------------------
 * Handles data persistence and business logic for the Live Studio.
 * Updated to use the unified `LiveClass` type definition.
 */

import {
  LiveClass,
  CreateLiveClassPayload,
  LiveStats,
} from "@/shared/types/liveClass.types"; // Unified Import
import { calculateEndTime } from "../utils/timeHelpers";

// Helper: Map Course/Batch IDs to Names (Simulates DB Lookup)
const getCourseName = (id: string): string => {
  const map: Record<string, string> = {
    "b-alpha": "Physics - Batch Alpha",
    "b-beta": "Maths - JEE Mains",
    "b-gamma": "Chemistry - Class XII",
    "b-delta": "Biology - NEET",
  };
  return map[id] || "General Batch";
};

// Mock Data (Refactored to new schema)
const MOCK_SESSIONS: LiveClass[] = [
  {
    id: "s-101",
    courseId: "b-alpha",
    courseName: "Physics - Batch Alpha",
    title: "Thermodynamics: Laws & Entropy",
    description: "Deep dive into the 2nd law.",
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    duration: 60,
    meetingLink: "https://zoom.us/j/demo",
    status: "scheduled",
    registeredStudents: 45,
    actualAttendance: 0,
  },
  {
    id: "s-102",
    courseId: "b-beta",
    courseName: "Maths - JEE Mains",
    title: "Calculus: Derivatives",
    description: "Intro to derivatives.",
    scheduledAt: "2023-10-25T10:00:00.000Z",
    duration: 90,
    meetingLink: "https://meet.google.com/demo",
    status: "completed",
    recordingUrl: "https://youtube.com/demo",
    registeredStudents: 50,
    actualAttendance: 42,
  },
  {
    id: "s-103",
    courseId: "b-gamma",
    courseName: "Chemistry - Class XII",
    title: "Organic Chemistry: Alcohols",
    description: "Properties and reactions.",
    scheduledAt: new Date(Date.now() - 7200000).toISOString(),
    duration: 60,
    meetingLink: "https://zoom.us/j/test",
    status: "completed",
    registeredStudents: 30,
    actualAttendance: 28,
  },
];

export const LiveService = {
  /**
   * Fetches all sessions sorted by scheduled time.
   */
  fetchAll: async (): Promise<LiveClass[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [...MOCK_SESSIONS].sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  },

  /**
   * Creates a new session with proper course name mapping.
   */
  create: async (payload: CreateLiveClassPayload): Promise<LiveClass> => {
    await new Promise((r) => setTimeout(r, 800));

    const courseName = getCourseName(payload.courseId);

    const newSession: LiveClass = {
      id: `s-${Date.now()}`,
      courseName,
      status: "scheduled",
      registeredStudents: 0,
      actualAttendance: 0,
      ...payload,
    };

    MOCK_SESSIONS.unshift(newSession);
    return newSession;
  },

  /**
   * Updates recording URL for archived sessions.
   */
  updateRecording: async (id: string, url: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
    const session = MOCK_SESSIONS.find((s) => s.id === id);
    if (session) {
      session.recordingUrl = url;
      session.status = "completed";
    }
  },

  /**
   * Aggregates dashboard statistics.
   */
  getStats: async (): Promise<LiveStats> => {
    await new Promise((r) => setTimeout(r, 400));
    const completed = MOCK_SESSIONS.filter((s) => s.status === "completed");

    const totalHours = completed.reduce(
      (acc, s) => acc + (s.duration || 0) / 60,
      0,
    );

    const avgAtt =
      completed.length > 0
        ? completed.reduce(
            (acc, s) =>
              acc +
              ((s.actualAttendance || 0) / (s.registeredStudents || 1)) * 100,
            0,
          ) / completed.length
        : 0;

    return {
      totalClasses: completed.length,
      totalHours: parseFloat(totalHours.toFixed(1)),
      avgAttendancePercentage: Math.round(avgAtt),
    };
  },
};
