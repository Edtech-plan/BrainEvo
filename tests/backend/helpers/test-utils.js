const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: { id: '507f1f77bcf86cd799439011' },
  ...overrides,
});

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
  return res;
};

const createMockNext = () => jest.fn();

const createMockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student',
  ...overrides,
});

const TEST_USER_ID = '507f1f77bcf86cd799439011';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockNext,
  createMockUser,
  TEST_USER_ID,
  TEST_EMAIL,
  TEST_PASSWORD,
};
