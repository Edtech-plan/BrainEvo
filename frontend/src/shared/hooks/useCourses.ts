import { useState, useEffect } from 'react';
import courseService from '../../modules/course/course.service';
import type { Course, CreateCourseData, UpdateCourseData } from '../types';
import type { AppErrorType } from '../types/errors.types';
import { getErrorMessage } from '../types/errors.types';

/**
 * Courses Hook
 */
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCourses();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (err: AppErrorType) {
      setError(getErrorMessage(err) || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (courseData: CreateCourseData): Promise<Course | undefined> => {
    try {
      const response = await courseService.createCourse(courseData);
      if (response.success) {
        await fetchCourses();
        return response.data;
      }
    } catch (err: AppErrorType) {
      throw new Error(getErrorMessage(err) || 'Failed to create course');
    }
  };

  const updateCourse = async (id: string, courseData: UpdateCourseData): Promise<Course | undefined> => {
    try {
      const response = await courseService.updateCourse(id, courseData);
      if (response.success) {
        await fetchCourses();
        return response.data;
      }
    } catch (err: AppErrorType) {
      throw new Error(getErrorMessage(err) || 'Failed to update course');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await courseService.deleteCourse(id);
      if (response.success) {
        await fetchCourses();
      }
    } catch (err: AppErrorType) {
      throw new Error(getErrorMessage(err) || 'Failed to delete course');
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
