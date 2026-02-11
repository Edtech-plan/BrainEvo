import {
  Batch,
  BatchStudent,
  BatchResource,
  CreateBatchPayload,
  BatchStats,
} from "../../../../shared/types/batch.types";

// 1. Mutable Mock Data (Existing)
const MOCK_BATCHES: Batch[] = [
  {
    id: "b-101",
    name: "Physics - Class XI",
    schedule: { days: ["Mon", "Wed"], startTime: "10:00", endTime: "11:30" },
    startDate: "2023-09-01",
    studentCount: 34,
    status: "active",
  },
  {
    id: "b-102",
    name: "Mathematics - JEE",
    schedule: { days: ["Tue", "Thu"], startTime: "16:00", endTime: "18:00" },
    startDate: "2023-08-15",
    studentCount: 18,
    status: "active",
  },
];

const MOCK_STUDENTS: BatchStudent[] = [
  {
    id: "s-1",
    name: "Kush Kore",
    email: "kush@brainevo.com",
    joinDate: "2023-09-02",
    attendanceRate: 98,
    status: "active",
  },
  {
    id: "s-2",
    name: "Yash Pagdhare",
    email: "yash@brainevo.com",
    joinDate: "2023-09-05",
    attendanceRate: 65,
    status: "at_risk",
  },
];

// CHANGED: Use 'let' so we can update it with new uploads
const MOCK_RESOURCES: BatchResource[] = [
  {
    id: "r-1",
    title: "Kinematics Notes",
    type: "pdf",
    url: "#",
    size: "2.4 MB",
    uploadDate: "2023-10-01",
    isPublished: true,
  },
];

export const BatchesService = {
  fetchAll: async (): Promise<Batch[]> => {
    await new Promise((r) => setTimeout(r, 800));
    return [...MOCK_BATCHES];
  },

  fetchById: async (id: string): Promise<Batch> => {
    await new Promise((r) => setTimeout(r, 500));
    const b = MOCK_BATCHES.find((x) => x.id === id);
    if (!b) throw new Error("Batch not found");
    return b;
  },

  fetchStats: async (batchId: string): Promise<BatchStats> => {
    await new Promise((r) => setTimeout(r, 400));
    return { avgAttendance: 82, avgPerformance: 76 };
  },

  create: async (payload: CreateBatchPayload): Promise<Batch> => {
    await new Promise((r) => setTimeout(r, 1000));

    const newBatch: Batch = {
      id: `b-${Date.now()}`,
      ...payload,
      studentCount: 0,
      status: "active",
    };

    MOCK_BATCHES.unshift(newBatch);
    return newBatch;
  },

  fetchStudents: async (batchId: string): Promise<BatchStudent[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [...MOCK_STUDENTS];
  },

  fetchResources: async (batchId: string): Promise<BatchResource[]> => {
    await new Promise((r) => setTimeout(r, 600));
    return [...MOCK_RESOURCES];
  },

  // --- NEW METHOD: Upload Logic ---
  uploadResource: async (
    batchId: string,
    file: File,
  ): Promise<BatchResource> => {
    await new Promise((r) => setTimeout(r, 1500)); // Simulate network delay

    // 1. Determine type based on MIME
    let type: "pdf" | "video" | "link" = "link";
    if (file.type.includes("pdf")) type = "pdf";
    else if (file.type.includes("video")) type = "video";

    // 2. Format size (e.g., "3.5 MB")
    const size = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const newResource: BatchResource = {
      id: `r-${Date.now()}`,
      title: file.name,
      type: type,
      url: URL.createObjectURL(file), // Creates a local preview URL
      size: size,
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isPublished: true,
    };

    // 3. Persist to mock DB
    MOCK_RESOURCES.unshift(newResource);

    return newResource;
  },
};
