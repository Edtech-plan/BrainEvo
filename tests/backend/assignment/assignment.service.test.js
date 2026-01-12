const assignmentService = require('backend/src/modules/assignment/assignment.service');
const Assignment = require('backend/src/modules/assignment/assignment.model');

jest.mock('backend/src/modules/assignment/assignment.model');

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
});
