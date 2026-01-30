import apiClient from '@/shared/lib/axios';
import type { Assignment, Submission } from '@/shared/types/assignment.types';

interface BackendAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore?: number;
  pointsTotal?: number;
  status: string;
  subject?: string;
  instructorName?: string;
  course?: { title?: string; instructor?: { name?: string } };
  mySubmission?: {
    id: string;
    assignmentId: string;
    submittedAt: string;
    fileUrl?: string;
    linkUrl?: string;
    grade?: number;
    feedback?: string;
  };
  attachments?: Assignment['attachments'];
}

interface BackendListResponse {
  success: boolean;
  data: BackendAssignment[];
  count?: number;
}

interface BackendSingleResponse {
  success: boolean;
  data: BackendAssignment;
}

function mapAssignment(a: BackendAssignment): Assignment {
  return {
    id: a.id,
    title: a.title,
    subject: a.subject ?? a.course?.title ?? 'Course',
    instructorName: a.instructorName ?? a.course?.instructor?.name ?? 'Instructor',
    description: a.description,
    dueDate: typeof a.dueDate === 'string' ? a.dueDate : new Date(a.dueDate).toISOString(),
    pointsTotal: a.pointsTotal ?? a.maxScore ?? 100,
    status: a.status as Assignment['status'],
    attachments: a.attachments,
    mySubmission: a.mySubmission ? mapSubmission(a.mySubmission) : undefined,
  };
}

function mapSubmission(s: BackendAssignment['mySubmission']): Submission | undefined {
  if (!s) return undefined;
  return {
    id: s.id,
    assignmentId: s.assignmentId,
    submittedAt: s.submittedAt,
    fileUrl: s.fileUrl,
    linkUrl: s.linkUrl,
    grade: s.grade,
    feedback: s.feedback,
  };
}

class AssignmentService {
  async getAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get<BackendListResponse>('/api/assignments');
    const data = response.data?.data ?? [];
    return data.map(mapAssignment);
  }

  async getAssignment(id: string): Promise<Assignment | null> {
    const response = await apiClient.get<BackendSingleResponse>(`/api/assignments/${id}`);
    const data = response.data?.data;
    return data ? mapAssignment(data) : null;
  }

  async submitWork(
    assignmentId: string,
    data: { file?: File; link?: string }
  ): Promise<boolean> {
    const body: { assignmentId: string; content?: string; fileUrl?: string; linkUrl?: string } = {
      assignmentId,
    };
    if (data.link) {
      body.linkUrl = data.link;
      body.content = data.link;
    }
    if (data.file) {
      // --- FILE UPLOAD FEATURE CLOSED FOR NOW ---
      // When backend POST /api/submissions/upload is enabled:
      // const formData = new FormData();
      // formData.append('file', data.file);
      // const uploadRes = await apiClient.post<{ success: boolean; fileUrl?: string }>('/api/submissions/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      // if (uploadRes.data?.fileUrl) body.fileUrl = uploadRes.data.fileUrl;
      body.content = `File: ${data.file.name}`;
    }
    const response = await apiClient.post<{ success: boolean }>('/api/submissions', body);
    return response.data?.success ?? false;
  }
}

export default new AssignmentService();
