/**
 * Live Class Service (Mock Layer)
 * -------------------------------------
 * This service mimics the backend API behavior for the Live Class Studio.
 * It handles data persistence in memory (`MOCK_SESSIONS`) and simulates
 * network latency to ensure the UI handles loading states correctly.
 */

import {
  LiveSession,
  CreateSessionPayload,
  LiveStats,
} from "../../../../shared/types/live.types";
import { calculateEndTime } from "../utils/timeHelpers";

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

/**
 * Simulates a Database JOIN or lookup operation.
 * In a real backend, the `batchId` would be used to fetch the `batchName`
 * from a 'Batches' table. Here, we map it statically.
 */
const getBatchName = (id: string): string => {
  const batchMap: Record<string, string> = {
    "b-alpha": "Physics - Batch Alpha",
    "b-beta": "Maths - JEE Mains",
    "b-gamma": "Chemistry - Class XII",
    "b-delta": "Biology - NEET",
  };
  // Fallback for unknown IDs
  return batchMap[id] || "General Batch";
};

// ==========================================
// 2. MOCK DATABASE (In-Memory Storage)
// ==========================================

const MOCK_SESSIONS: LiveSession[] = [
  // Scenario A: Future scheduled class
  {
    id: "s-101",
    batchId: "b-alpha",
    batchName: "Physics - Batch Alpha",
    topic: "Thermodynamics: Laws & Entropy",
    description: "Deep dive into the 2nd law.",
    startTime: new Date(Date.now() + 3600000).toISOString(), // Starts in 1 hour
    endTime: new Date(Date.now() + 7200000).toISOString(),
    durationMinutes: 60,
    meetingLink: "https://zoom.us/j/demo",
    status: "scheduled",
    registeredStudents: 45,
    actualAttendance: 0,
  },
  // Scenario B: Completed class WITH recording (Archived)
  {
    id: "s-102",
    batchId: "b-beta",
    batchName: "Maths - JEE Mains",
    topic: "Calculus: Derivatives",
    description: "Intro to derivatives.",
    startTime: "2023-10-25T10:00:00.000Z",
    endTime: "2023-10-25T11:30:00.000Z",
    durationMinutes: 90,
    meetingLink: "https://meet.google.com/demo",
    status: "completed",
    recordingUrl: "https://youtube.com/demo", // URL present -> "Watch" button shows
    registeredStudents: 50,
    actualAttendance: 42,
  },
  // Scenario C: Completed class WITHOUT recording (Action Required)
  {
    id: "s-103",
    batchId: "b-gamma",
    batchName: "Chemistry - Class XII",
    topic: "Organic Chemistry: Alcohols",
    description: "Properties and reactions.",
    startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    durationMinutes: 60,
    meetingLink: "https://zoom.us/j/test",
    status: "completed",
    // recordingUrl is MISSING -> "Add Recording" button shows
    registeredStudents: 30,
    actualAttendance: 28,
  },
];

// ==========================================
// 3. SERVICE METHODS
// ==========================================

export const LiveService = {
  /**
   * GET /api/live-sessions
   * Fetches all sessions and sorts them by start time (Ascending).
   */
  fetchAll: async (): Promise<LiveSession[]> => {
    // Simulate network delay (600ms)
    await new Promise((r) => setTimeout(r, 600));

    // Return a copy of the array sorted by date
    return [...MOCK_SESSIONS].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  },

  /**
   * POST /api/live-sessions
   * Creates a new session, calculates end time, and looks up batch details.
   */
  create: async (payload: CreateSessionPayload): Promise<LiveSession> => {
    await new Promise((r) => setTimeout(r, 800));

    // 1. Resolve Batch Name from ID
    const batchName = getBatchName(payload.batchId);

    // 2. Construct the full Session Object
    const newSession: LiveSession = {
      id: `s-${Date.now()}`, // Generate unique ID
      batchName, // Mapped name
      status: "scheduled",
      registeredStudents: 0, // Default for new classes
      actualAttendance: 0,
      endTime: calculateEndTime(payload.startTime, payload.durationMinutes),
      ...payload, // Spread the form data (topic, link, etc.)
    };

    // 3. Save to "Database"
    MOCK_SESSIONS.unshift(newSession); // Add to top of list
    return newSession;
  },

  /**
   * PATCH /api/live-sessions/:id
   * Updates a session with a recording URL and ensures status is 'completed'.
   */
  updateRecording: async (id: string, url: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));

    const session = MOCK_SESSIONS.find((s) => s.id === id);
    if (session) {
      session.recordingUrl = url;
      session.status = "completed"; // Mark as fully complete
    }
  },

  /**
   * GET /api/live-sessions/stats
   * Aggregates data on the server side to return dashboard metrics.
   * Calculates Total Hours, Class Count, and Average Attendance.
   */
  getStats: async (): Promise<LiveStats> => {
    await new Promise((r) => setTimeout(r, 400));

    // Filter only completed sessions for accurate stats
    const completed = MOCK_SESSIONS.filter((s) => s.status === "completed");

    // Calculation: Total Teaching Hours
    const totalHours = completed.reduce(
      (acc, s) => acc + s.durationMinutes / 60,
      0,
    );

    // Calculation: Average Attendance Percentage
    const avgAtt =
      completed.length > 0
        ? completed.reduce(
            (acc, s) => acc + (s.actualAttendance / s.registeredStudents) * 100,
            0,
          ) / completed.length
        : 0;

    return {
      totalClasses: completed.length,
      totalHours: parseFloat(totalHours.toFixed(1)), // Round to 1 decimal
      avgAttendancePercentage: Math.round(avgAtt), // Round to whole number
    };
  },
};
