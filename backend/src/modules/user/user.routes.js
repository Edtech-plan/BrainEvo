const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('./user.controller');
const { auth, authorize } = require('../../guards/auth.guard');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
router.get('/', authorize('admin', 'teacher'), getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
router.get('/:id', getUser);

// @route   PUT /api/users/:id
// @desc    Update user
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
