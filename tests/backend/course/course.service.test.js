const courseService = require('backend/src/modules/course/course.service');
const Course = require('backend/src/modules/course/course.model');

jest.mock('backend/src/modules/course/course.model');

describe('CourseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all courses with populated instructor', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course 1', instructor: { name: 'Instructor 1', email: 'inst1@example.com' } },
        { _id: '2', title: 'Course 2', instructor: { name: 'Instructor 2', email: 'inst2@example.com' } },
      ];

      Course.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCourses),
      });

      const result = await courseService.findAll();

      expect(result).toEqual(mockCourses);
      expect(Course.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return course by id with populated instructor', async () => {
      const courseId = '507f1f77bcf86cd799439011';
      const mockCourse = { _id: courseId, title: 'Test Course', instructor: { name: 'Instructor', email: 'inst@example.com' } };

      Course.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCourse),
      });

      const result = await courseService.findById(courseId);

      expect(result).toEqual(mockCourse);
      expect(Course.findById).toHaveBeenCalledWith(courseId);
    });
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const courseData = {
        title: 'New Course',
        description: 'Course description',
        instructor: '507f1f77bcf86cd799439011',
      };

      const mockCourse = { _id: '1', ...courseData };
      Course.create.mockResolvedValue(mockCourse);

      const result = await courseService.create(courseData);

      expect(result).toEqual(mockCourse);
      expect(Course.create).toHaveBeenCalledWith(courseData);
    });
  });

  describe('update', () => {
    it('should update course by id', async () => {
      const courseId = '507f1f77bcf86cd799439011';
      const updateData = { title: 'Updated Course' };
      const mockCourse = { _id: courseId, ...updateData };

      Course.findByIdAndUpdate.mockResolvedValue(mockCourse);

      const result = await courseService.update(courseId, updateData);

      expect(result).toEqual(mockCourse);
      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        courseId,
        updateData,
        { new: true, runValidators: true }
      );
    });
  });

  describe('delete', () => {
    it('should delete course by id', async () => {
      const courseId = '507f1f77bcf86cd799439011';
      const mockCourse = { _id: courseId, title: 'Test Course' };

      Course.findByIdAndDelete.mockResolvedValue(mockCourse);

      const result = await courseService.delete(courseId);

      expect(result).toEqual(mockCourse);
      expect(Course.findByIdAndDelete).toHaveBeenCalledWith(courseId);
    });
  });
});
