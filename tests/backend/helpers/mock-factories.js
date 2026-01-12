const { createMockUser, TEST_USER_ID, TEST_EMAIL } = require('./test-utils');

const createAuthResult = (overrides = {}) => ({
  token: 'mock-jwt-token',
  user: {
    id: TEST_USER_ID,
    name: 'Test User',
    email: TEST_EMAIL,
    role: 'student',
  },
  ...overrides,
});

const createUserData = (overrides = {}) => ({
  name: 'Test User',
  email: TEST_EMAIL,
  password: 'password123',
  role: 'student',
  ...overrides,
});

const createCourseData = (overrides = {}) => ({
  title: 'Test Course',
  description: 'Course description',
  instructor: TEST_USER_ID,
  ...overrides,
});

const createAssignmentData = (overrides = {}) => ({
  title: 'Test Assignment',
  description: 'Assignment description',
  course: '507f1f77bcf86cd799439012',
  dueDate: new Date('2024-12-31'),
  ...overrides,
});

module.exports = {
  createAuthResult,
  createUserData,
  createCourseData,
  createAssignmentData,
};
