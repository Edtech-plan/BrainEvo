import apiClient from "../../../../shared/lib/axios";
import type {
  Batch,
  BatchStudent,
  BatchResource,
  BatchStats,
  CreateBatchPayload,
} from "../../../../shared/types/batch.types";

const API_BASE = "/api/batches";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const BatchesService = {
  fetchAll: async (page = 1, limit = 20): Promise<{ batches: Batch[]; pagination?: PaginatedResponse<Batch>["pagination"] }> => {
    const response = await apiClient.get<PaginatedResponse<Batch>>(
      `${API_BASE}?page=${page}&limit=${limit}`
    );
    const data = response.data?.data ?? [];
    const batches = data.map(normalizeBatch);
    return { batches, pagination: response.data?.pagination };
  },

  fetchById: async (id: string): Promise<Batch> => {
    const response = await apiClient.get<ApiResponse<Batch>>(`${API_BASE}/${id}`);
    const data = response.data?.data;
    if (!data) throw new Error("Batch not found");
    return normalizeBatch(data);
  },

  fetchStats: async (batchId: string): Promise<BatchStats> => {
    const response = await apiClient.get<ApiResponse<BatchStats>>(
      `${API_BASE}/${batchId}/stats`
    );
    const data = response.data?.data;
    if (!data) throw new Error("Stats not found");
    return data;
  },

  create: async (payload: CreateBatchPayload): Promise<Batch> => {
    const response = await apiClient.post<ApiResponse<Batch>>(API_BASE, payload);
    const data = response.data?.data;
    if (!data) throw new Error("Failed to create batch");
    return normalizeBatch(data);
  },

  fetchStudents: async (batchId: string): Promise<BatchStudent[]> => {
    const response = await apiClient.get<ApiResponse<BatchStudent[]>>(
      `${API_BASE}/${batchId}/students`
    );
    const data = response.data?.data ?? [];
    return data.map(normalizeStudent);
  },

  fetchResources: async (batchId: string): Promise<BatchResource[]> => {
    const response = await apiClient.get<ApiResponse<BatchResource[]>>(
      `${API_BASE}/${batchId}/resources`
    );
    const data = response.data?.data ?? [];
    return data.map(normalizeResource);
  },

  uploadResource: async (
    batchId: string,
    file: File
  ): Promise<BatchResource> => {
    let type: "pdf" | "video" | "link" = "link";
    if (file.type.includes("pdf")) type = "pdf";
    else if (file.type.includes("video")) type = "video";

    const size = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const response = await apiClient.post<ApiResponse<BatchResource>>(
      `${API_BASE}/${batchId}/resources`,
      {
        title: file.name,
        type,
        url: "#",
        size,
      }
    );
    const data = response.data?.data;
    if (!data) throw new Error("Failed to upload resource");
    return normalizeResource(data);
  },

  deleteResource: async (batchId: string, resourceId: string): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${batchId}/resources/${resourceId}`);
  },

  addStudent: async (batchId: string, studentId: string): Promise<BatchStudent> => {
    const response = await apiClient.post<ApiResponse<BatchStudent>>(
      `${API_BASE}/${batchId}/students`,
      { studentId }
    );
    const data = response.data?.data;
    if (!data) throw new Error("Failed to add student");
    return normalizeStudent(data);
  },

  removeStudent: async (batchId: string, studentId: string): Promise<void> => {
    await apiClient.delete(`${API_BASE}/${batchId}/students/${studentId}`);
  },
};

function normalizeBatch(b: Batch): Batch {
  return {
    ...b,
    schedule: b.schedule || { days: [], startTime: "09:00", endTime: "10:30" },
    startDate: typeof b.startDate === "string" ? b.startDate : String(b.startDate),
    studentCount: b.studentCount ?? 0,
    status: b.status || "active",
  };
}

function normalizeStudent(s: BatchStudent): BatchStudent {
  return {
    ...s,
    joinDate: s.joinDate || "",
    attendanceRate: s.attendanceRate ?? 0,
    status: s.status || "active",
  };
}

function normalizeResource(r: BatchResource): BatchResource {
  return {
    ...r,
    type: r.type || "link",
    size: r.size || "",
    uploadDate: r.uploadDate || "",
    isPublished: r.isPublished !== false,
  };
}
