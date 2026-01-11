import { useState, useEffect } from 'react';
import courseService from '../../modules/course/course.service';

/**
 * Courses Hook
 */
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (courseData: any) => {
    try {
      const response = await courseService.createCourse(courseData);
      if (response.success) {
        await fetchCourses();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create course');
    }
  };

  const updateCourse = async (id: string, courseData: any) => {
    try {
      const response = await courseService.updateCourse(id, courseData);
      if (response.success) {
        await fetchCourses();
        return response.data;
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update course');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await courseService.deleteCourse(id);
      if (response.success) {
        await fetchCourses();
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete course');
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
