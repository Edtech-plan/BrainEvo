const assignmentService = require('backend/src/modules/assignment/assignment.service');
const Assignment = require('backend/src/modules/assignment/assignment.model');
const Submission = require('backend/src/modules/submission/submission.model');

jest.mock('backend/src/modules/assignment/assignment.model');
jest.mock('backend/src/modules/submission/submission.model');

describe('AssignmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all assignments with populated course', async () => {
      const mockAssignments = [
        { _id: '1', title: 'Assignment 1', course: { title: 'Course 1' } },
        { _id: '2', title: 'Assignment 2', course: { title: 'Course 2' } },
      ];

      Assignment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignments),
      });

      const result = await assignmentService.findAll();

      expect(result).toEqual(mockAssignments);
      expect(Assignment.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return assignment by id with populated course', async () => {
      const assignmentId = '507f1f77bcf86cd799439011';
      const mockAssignment = { _id: assignmentId, title: 'Test Assignment', course: { title: 'Test Course' } };

      Assignment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignment),
      });

      const result = await assignmentService.findById(assignmentId);

      expect(result).toEqual(mockAssignment);
      expect(Assignment.findById).toHaveBeenCalledWith(assignmentId);
    });
  });

  describe('create', () => {
    it('should create a new assignment', async () => {
      const assignmentData = {
        title: 'New Assignment',
        description: 'Assignment description',
        course: '507f1f77bcf86cd799439011',
        dueDate: new Date('2024-12-31'),
      };

      const mockAssignment = { _id: '1', ...assignmentData };
      Assignment.create.mockResolvedValue(mockAssignment);

      const result = await assignmentService.create(assignmentData);

      expect(result).toEqual(mockAssignment);
      expect(Assignment.create).toHaveBeenCalledWith(assignmentData);
    });
  });

  describe('update', () => {
    it('should update assignment by id', async () => {
      const assignmentId = '507f1f77bcf86cd799439011';
      const updateData = { title: 'Updated Assignment' };
      const mockAssignment = { _id: assignmentId, ...updateData };

      Assignment.findByIdAndUpdate.mockResolvedValue(mockAssignment);

      const result = await assignmentService.update(assignmentId, updateData);

      expect(result).toEqual(mockAssignment);
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        assignmentId,
        updateData,
        { new: true, runValidators: true }
      );
    });
  });

  describe('delete', () => {
    it('should delete assignment by id', async () => {
      const assignmentId = '507f1f77bcf86cd799439011';
      const mockAssignment = { _id: assignmentId, title: 'Test Assignment' };

      Assignment.findByIdAndDelete.mockResolvedValue(mockAssignment);

      const result = await assignmentService.delete(assignmentId);

      expect(result).toEqual(mockAssignment);
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(assignmentId);
    });
  });

  describe('findAllForUser', () => {
    it('should return assignments with status and mySubmission for user', async () => {
      const userId = '507f1f77bcf86cd799439099';
      const dueFuture = new Date(Date.now() + 86400000);
      const mockAssignments = [
        {
          _id: 'a1',
          title: 'Assignment 1',
          description: 'Desc 1',
          dueDate: dueFuture,
          maxScore: 100,
          course: { title: 'Course 1', instructor: { name: 'Instructor One' } },
          toObject() {
            return { ...this };
          },
        },
      ];
      const mockSubmissions = [];

      Assignment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignments),
      });
      Submission.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSubmissions),
      });

      const result = await assignmentService.findAllForUser(userId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('a1');
      expect(result[0].title).toBe('Assignment 1');
      expect(result[0].status).toBe('PENDING');
      expect(result[0].subject).toBe('Course 1');
      expect(result[0].instructorName).toBe('Instructor One');
      expect(result[0].pointsTotal).toBe(100);
      expect(result[0].mySubmission).toBeUndefined();
      expect(Assignment.find).toHaveBeenCalled();
      expect(Submission.find).toHaveBeenCalledWith({ student: userId });
    });

    it('should attach mySubmission and GRADED status when user has submission', async () => {
      const userId = '507f1f77bcf86cd799439099';
      const assignmentId = 'a1';
      const mockAssignments = [
        {
          _id: assignmentId,
          title: 'Assignment 1',
          description: 'Desc 1',
          dueDate: new Date(Date.now() + 86400000),
          maxScore: 100,
          course: { title: 'Course 1', instructor: { name: 'Inst' } },
          toObject() {
            return { ...this };
          },
        },
      ];
      const mockSubmission = {
        _id: 'sub1',
        assignment: assignmentId,
        student: userId,
        status: 'graded',
        score: 85,
        feedback: 'Good work',
        fileUrl: null,
        linkUrl: 'https://example.com',
        createdAt: new Date(),
        toObject() {
          return { ...this, createdAt: this.createdAt };
        },
      };

      Assignment.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignments),
      });
      Submission.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([mockSubmission]),
      });

      const result = await assignmentService.findAllForUser(userId);

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('GRADED');
      expect(result[0].mySubmission).toBeDefined();
      expect(result[0].mySubmission.id).toBe('sub1');
      expect(result[0].mySubmission.grade).toBe(85);
      expect(result[0].mySubmission.feedback).toBe('Good work');
    });
  });

  describe('findByIdForUser', () => {
    it('should return null when assignment not found', async () => {
      Assignment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const result = await assignmentService.findByIdForUser('nonexistent', 'user1');

      expect(result).toBeNull();
    });

    it('should return assignment with status and mySubmission for user', async () => {
      const assignmentId = '507f1f77bcf86cd799439011';
      const userId = 'user123';
      const mockAssignment = {
        _id: assignmentId,
        title: 'Test Assignment',
        description: 'Desc',
        dueDate: new Date(Date.now() - 86400000),
        maxScore: 50,
        course: { title: 'Math', instructor: { name: 'Dr. Smith' } },
        toObject() {
          return { ...this };
        },
      };
      const mockSubmission = {
        _id: 'sub1',
        assignment: assignmentId,
        status: 'submitted',
        score: null,
        feedback: null,
        createdAt: new Date(),
        toObject() {
          return { ...this, createdAt: this.createdAt };
        },
      };

      Assignment.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockAssignment),
      });
      Submission.findOne.mockResolvedValue(mockSubmission);

      const result = await assignmentService.findByIdForUser(assignmentId, userId);

      expect(result).not.toBeNull();
      expect(result.id).toBe(assignmentId);
      expect(result.status).toBe('SUBMITTED');
      expect(result.mySubmission).toBeDefined();
      expect(result.subject).toBe('Math');
      expect(result.pointsTotal).toBe(50);
      expect(Assignment.findById).toHaveBeenCalledWith(assignmentId);
      expect(Submission.findOne).toHaveBeenCalledWith({ assignment: assignmentId, student: userId });
    });
  });
});
