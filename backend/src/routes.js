const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const courseRoutes = require('./modules/course/course.routes');
const assignmentRoutes = require('./modules/assignment/assignment.routes');
const submissionRoutes = require('./modules/submission/submission.routes');
const liveClassRoutes = require('./modules/liveClass/liveClass.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/live-classes', liveClassRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
