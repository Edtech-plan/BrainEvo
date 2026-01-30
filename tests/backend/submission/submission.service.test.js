const submissionService = require('backend/src/modules/submission/submission.service');
const Submission = require('backend/src/modules/submission/submission.model');
const Assignment = require('backend/src/modules/assignment/assignment.model');

jest.mock('backend/src/modules/submission/submission.model');
jest.mock('backend/src/modules/assignment/assignment.model');

describe('SubmissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a submission with linkUrl', async () => {
      const studentId = 'user1';
      const assignmentId = 'asgn1';
      const payload = { linkUrl: 'https://example.com/work', content: '' };

      Submission.findOne.mockResolvedValue(null);
      Assignment.findById.mockResolvedValue({ _id: assignmentId, title: 'Test' });
      const mockSubmission = {
        _id: 'sub1',
        student: studentId,
        assignment: assignmentId,
        linkUrl: payload.linkUrl,
        status: 'submitted',
      };
      Submission.create.mockResolvedValue(mockSubmission);

      const result = await submissionService.create(studentId, assignmentId, payload);

      expect(result).toEqual(mockSubmission);
      expect(Submission.findOne).toHaveBeenCalledWith({ assignment: assignmentId, student: studentId });
      expect(Assignment.findById).toHaveBeenCalledWith(assignmentId);
      expect(Submission.create).toHaveBeenCalledWith(
        expect.objectContaining({
          student: studentId,
          assignment: assignmentId,
          linkUrl: payload.linkUrl,
          status: 'submitted',
        })
      );
    });

    it('should throw when already submitted for assignment', async () => {
      const studentId = 'user1';
      const assignmentId = 'asgn1';
      Submission.findOne.mockResolvedValue({ _id: 'existing' });

      await expect(
        submissionService.create(studentId, assignmentId, { linkUrl: 'https://x.com' })
      ).rejects.toMatchObject({ message: 'Already submitted for this assignment', statusCode: 400 });

      expect(Submission.create).not.toHaveBeenCalled();
    });

    it('should throw when assignment not found', async () => {
      Submission.findOne.mockResolvedValue(null);
      Assignment.findById.mockResolvedValue(null);

      await expect(
        submissionService.create('user1', 'badId', { linkUrl: 'https://x.com' })
      ).rejects.toMatchObject({ message: 'Assignment not found', statusCode: 404 });

      expect(Submission.create).not.toHaveBeenCalled();
    });

    it('should throw when no content, fileUrl, or linkUrl', async () => {
      Submission.findOne.mockResolvedValue(null);
      Assignment.findById.mockResolvedValue({ _id: 'asgn1' });

      await expect(
        submissionService.create('user1', 'asgn1', { content: '', fileUrl: undefined, linkUrl: undefined })
      ).rejects.toMatchObject({ message: 'Provide at least one of content, fileUrl, or linkUrl', statusCode: 400 });

      expect(Submission.create).not.toHaveBeenCalled();
    });
  });

  describe('findByAssignmentAndStudent', () => {
    it('should return submission when found', async () => {
      const assignmentId = 'asgn1';
      const studentId = 'user1';
      const mockSubmission = { _id: 'sub1', assignment: assignmentId, student: studentId };

      Submission.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSubmission),
      });

      const result = await submissionService.findByAssignmentAndStudent(assignmentId, studentId);

      expect(result).toEqual(mockSubmission);
      expect(Submission.findOne).toHaveBeenCalledWith({ assignment: assignmentId, student: studentId });
    });
  });

  describe('findByAssignment', () => {
    it('should return list of submissions for assignment', async () => {
      const assignmentId = 'asgn1';
      const mockSubmissions = [
        { _id: 'sub1', assignment: assignmentId, student: 'user1' },
        { _id: 'sub2', assignment: assignmentId, student: 'user2' },
      ];

      Submission.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockSubmissions),
          }),
        }),
      });

      const result = await submissionService.findByAssignment(assignmentId);

      expect(result).toEqual(mockSubmissions);
      expect(Submission.find).toHaveBeenCalledWith({ assignment: assignmentId });
    });
  });

  describe('updateGrade', () => {
    it('should update submission with score and feedback', async () => {
      const submissionId = 'sub1';
      const updateData = { score: 90, feedback: 'Great job!' };
      const mockGraded = {
        _id: submissionId,
        score: updateData.score,
        feedback: updateData.feedback,
        status: 'graded',
      };

      Submission.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockGraded),
        }),
      });

      const result = await submissionService.updateGrade(submissionId, updateData);

      expect(result).toEqual(mockGraded);
      expect(Submission.findByIdAndUpdate).toHaveBeenCalledWith(
        submissionId,
        expect.objectContaining({
          score: updateData.score,
          feedback: updateData.feedback,
          status: 'graded',
        }),
        { new: true, runValidators: true }
      );
    });
  });
});
