const authController = require('backend/src/modules/auth/auth.controller');
const authService = require('backend/src/modules/auth/auth.service');
const userService = require('backend/src/modules/user/user.service');
const {
  createMockRequest,
  createMockResponse,
  createMockNext,
} = require('../helpers/test-utils');
const { createAuthResult, createUserData } = require('../helpers/mock-factories');

jest.mock('backend/src/modules/auth/auth.service');
jest.mock('backend/src/modules/user/user.service');

describe('AuthController', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
  });

  describe('register', () => {
    it('should register user successfully and return 201', async () => {
      req.body = createUserData();
      const mockResult = createAuthResult();

      authService.register.mockResolvedValue(mockResult);

      await authController.register(req, res, next);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, ...mockResult });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 when user already exists', async () => {
      req.body = createUserData();
      const error = new Error('User already exists');

      authService.register.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next for unexpected errors', async () => {
      req.body = createUserData();
      const error = new Error('Database error');

      authService.register.mockRejectedValue(error);

      await authController.register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully and return 200', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResult = createAuthResult();

      authService.login.mockResolvedValue(mockResult);

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.json).toHaveBeenCalledWith({ success: true, ...mockResult });
      expect(res.status).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when credentials are invalid', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const error = new Error('Invalid credentials');

      authService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next for unexpected errors', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Server error');

      authService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('should return current authenticated user', async () => {
      const mockUser = {
        id: req.user.id,
        name: 'Test User',
        email: 'test@example.com',
      };

      userService.findById.mockResolvedValue(mockUser);

      await authController.getMe(req, res, next);

      expect(userService.findById).toHaveBeenCalledWith(req.user.id);
      expect(res.json).toHaveBeenCalledWith({ success: true, user: mockUser });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next when user not found', async () => {
      const error = new Error('User not found');
      userService.findById.mockRejectedValue(error);

      await authController.getMe(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
