const userService = require('backend/src/modules/user/user.service');
const User = require('backend/src/modules/user/user.model');

jest.mock('backend/src/modules/user/user.model');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' },
      ];

      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers),
      });

      const result = await userService.findAll();

      expect(result).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user by id without password', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = { _id: userId, name: 'Test User', email: 'test@example.com' };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.findById(userId);

      expect(result).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        _id: '1',
        name: 'Test User',
        email,
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = { _id: '1', ...userData };
      User.create.mockResolvedValue(mockUser);

      const result = await userService.create(userData);

      expect(result).toEqual(mockUser);
      expect(User.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('update', () => {
    it('should update user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'Updated Name' };
      const mockUser = { _id: userId, ...updateData };

      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.update(userId, updateData);

      expect(result).toEqual(mockUser);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = { _id: userId, name: 'Test User' };

      User.findByIdAndDelete.mockResolvedValue(mockUser);

      const result = await userService.delete(userId);

      expect(result).toEqual(mockUser);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });
  });
});
