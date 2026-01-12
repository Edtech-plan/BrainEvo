const authService = require('backend/src/modules/auth/auth.service');
const userService = require('backend/src/modules/user/user.service');
const { createMockUser, TEST_USER_ID, TEST_EMAIL, TEST_PASSWORD } = require('../helpers/test-utils');
const { createUserData } = require('../helpers/mock-factories');

jest.mock('backend/src/modules/user/user.service');
jest.mock('backend/src/config/env', () => ({
  JWT_SECRET: 'test-secret-key',
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully and return token with user data', async () => {
      const userData = createUserData();
      const mockUser = createMockUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser._id.toString());
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.role).toBe(userData.role);
      expect(userService.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userService.create).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
    });

    it('should throw error when user already exists', async () => {
      const userData = createUserData();
      const existingUser = createMockUser({ email: userData.email });

      userService.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(userData)).rejects.toThrow('User already exists');
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user with valid credentials and return token', async () => {
      const email = TEST_EMAIL;
      const password = TEST_PASSWORD;
      const mockUser = createMockUser({
        email,
        comparePassword: jest.fn().mockResolvedValue(true),
      });

      userService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(email, password);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser._id.toString());
      expect(result.user.email).toBe(email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw error when user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const password = TEST_PASSWORD;

      userService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw error when password is incorrect', async () => {
      const email = TEST_EMAIL;
      const password = 'wrongpassword';
      const mockUser = createMockUser({
        email,
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      userService.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token string', () => {
      const userId = TEST_USER_ID;
      const token = authService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different user IDs', () => {
      const userId1 = TEST_USER_ID;
      const userId2 = '507f1f77bcf86cd799439012';

      const token1 = authService.generateToken(userId1);
      const token2 = authService.generateToken(userId2);

      expect(token1).not.toBe(token2);
    });
  });
});
