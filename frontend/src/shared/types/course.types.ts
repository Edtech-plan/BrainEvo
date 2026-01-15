/**
 * Course Types
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  price?: number;
}
